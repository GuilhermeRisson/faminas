import pandas as pd
import numpy as np
import os
import unicodedata
import re

# =========================
# 1. Leitura do arquivo CSVW
# =========================
caminho_arquivo = r'C:\Users\gui_r\OneDrive\Documentos\faminas\ciencia de dados\trabalho\Atividade\vendas_modificado.csv'
df = pd.read_csv(caminho_arquivo)
print("✅ Arquivo carregado com sucesso!")

# =========================
# 2. Padronização dos nomes das colunas
# =========================
def padronizar_coluna(col):
    col = unicodedata.normalize('NFKD', col).encode('ASCII', 'ignore').decode('utf-8')
    col = re.sub(r'[^a-zA-Z0-9_]', '_', col).lower()
    col = re.sub(r'_+', '_', col).strip('_')
    return col

df.columns = [padronizar_coluna(col) for col in df.columns]

# =========================
# 3. Ordenar pelo id_compra (assumindo esse nome padronizado)
# =========================
if 'id_compra' in df.columns:
    df = df.sort_values(by='id_compra')

# =========================
# 4. Remover colunas totalmente vazias ou com apenas um valor
# =========================
df.dropna(axis=1, how='all', inplace=True)

for col in df.columns:
    if df[col].nunique() <= 1:
        df.drop(columns=col, inplace=True)

# =========================
# 5. Remover colunas com alta unicidade (prováveis IDs)
# =========================
limite_unicidade = 0.9
for col in df.columns:
    if df[col].nunique() / len(df) > limite_unicidade:
        df.drop(columns=col, inplace=True)

# =========================
# 6. Limpeza de texto (acentos, símbolos)
# =========================
def limpar_texto(texto):
    if isinstance(texto, str):
        texto = texto.strip().lower()
        texto = unicodedata.normalize('NFKD', texto).encode('ASCII', 'ignore').decode('utf-8')
        texto = re.sub(r'[^a-zA-Z0-9\s]', '', texto)
    return texto

df = df.applymap(lambda x: limpar_texto(x) if isinstance(x, str) else x)

# =========================
# 7. Padronização de produtos
# =========================
if 'produto' in df.columns:
    df['produto'] = df['produto'].replace({
        'tv led': 'tv',
        'tv lcd': 'tv',
        'smartphone': 'celular',
        'celulares': 'celular',
        'notebook': 'laptop',
        'notebooks': 'laptop',
        'impresora': 'impressora',
        'impressores': 'impressora'
    })

# =========================
# 8. Padronização de CEP
# =========================
if 'cep' in df.columns:
    df['cep'] = df['cep'].astype(str).str.extract('(\d{5}\-?\d{3})', expand=False)
    df['cep'] = df['cep'].str.replace('-', '')
    df['cep'] = df['cep'].where(df['cep'].str.len() == 8, np.nan)

# =========================
# 9. Correção de valores monetários
# =========================
if 'valor' in df.columns:
    df['valor'] = df['valor'].replace(r'[^\d,.-]', '', regex=True)
    df['valor'] = df['valor'].str.replace(',', '.')
    df['valor'] = pd.to_numeric(df['valor'], errors='coerce')
    df = df[df['valor'] >= 0]

# =========================
# 10. Conversão de colunas com data
# =========================
colunas_data = [col for col in df.columns if 'data' in col]
for col in colunas_data:
    df[col] = pd.to_datetime(df[col], errors='coerce')

# =========================
# 11. Preencher ou remover dados faltantes
# =========================
for col in df.columns:
    proporcao_nulos = df[col].isna().mean()
    if proporcao_nulos <= 0.5:
        if df[col].dtype in [np.float64, np.int64]:
            df[col].fillna(df[col].mean(), inplace=True)
        else:
            moda = df[col].mode()
            if not moda.empty:
                df[col].fillna(moda[0], inplace=True)
            else:
                df[col].fillna("desconhecido", inplace=True)
    else:
        df.drop(columns=col, inplace=True)

# =========================
# 12. Remoção de duplicatas
# =========================
df.drop_duplicates(inplace=True)

# =========================
# 13. Detecção e remoção de outliers
# =========================
def remover_outliers(col):
    q1 = col.quantile(0.25)
    q3 = col.quantile(0.75)
    iqr = q3 - q1
    return (col >= q1 - 1.5 * iqr) & (col <= q3 + 1.5 * iqr)

for col in df.select_dtypes(include=[np.number]):
    df = df[remover_outliers(df[col])]

# =========================
# 15. Verificação detalhada de dados faltantes
# =========================
print("\n🔍 Análise de dados faltantes:")
print("=============================")
missing_data = df.isnull().sum()
missing_percent = (df.isnull().mean() * 100).round(2)
missing_report = pd.concat([missing_data, missing_percent], axis=1, keys=['Total Faltantes', '% Faltantes'])
print(missing_report[missing_report['Total Faltantes'] > 0])

# Remover linhas com dados faltantes críticos (se necessário)
df.dropna(subset=['produto', 'valor'], inplace=True)

# =========================
# 16. Análise de produtos com mesmo nome mas preços ou categorias diferentes
# =========================
if 'produto' in df.columns:
    # Verificar se temos colunas de categoria e marca
    tem_categoria = 'categoria' in df.columns
    tem_marca = 'marca' in df.columns
    
    # Agrupar produtos por nome para análise
    grouped = df.groupby('produto')['valor'].agg(['count', 'mean', 'std', 'min', 'max'])
    
    # Filtrar produtos com múltiplas entradas e variação de preço
    produtos_variaveis = grouped[(grouped['count'] > 1) & (grouped['std'] > 0)].sort_values('std', ascending=False)
    
    print("\n📊 Produtos com mesmo nome mas variação de preço:")
    print("==============================================")
    print(produtos_variaveis.head(10))
    
    # Se tivermos informações de categoria e marca, analisar discrepâncias
    if tem_categoria and tem_marca:
        produtos_discrepantes = []
        
        for produto in produtos_variaveis.index:
            sub_df = df[df['produto'] == produto]
            categorias_unicas = sub_df['categoria'].nunique()
            marcas_unicas = sub_df['marca'].nunique()
            
            if categorias_unicas > 1 or marcas_unicas > 1:
                produtos_discrepantes.append({
                    'produto': produto,
                    'categorias_diferentes': categorias_unicas,
                    'marcas_diferentes': marcas_unicas,
                    'variacao_preco': sub_df['valor'].max() - sub_df['valor'].min(),
                    'exemplo_categorias': list(sub_df['categoria'].unique()),
                    'exemplo_marcas': list(sub_df['marca'].unique())
                })
        
        if produtos_discrepantes:
            print("\n⚠️ Produtos com mesmo nome mas categorias ou marcas diferentes:")
            print("========================================================")
            discrepantes_df = pd.DataFrame(produtos_discrepantes)
            print(discrepantes_df.sort_values('variacao_preco', ascending=False))
            
            # Exportar essa análise para um arquivo separado
            caminho_discrepantes = r'C:\Users\gui_r\OneDrive\Documentos\faminas\ciencia de dados\trabalho\Atividade\produtos_discrepantes.csv'
            discrepantes_df.to_csv(caminho_discrepantes, index=False)
            print(f"\n✅ Lista de produtos discrepantes exportada para: {caminho_discrepantes}")

# =========================
# 17. Exportar para novo CSV limpo (atualizado)
# =========================

caminho_saida = r'C:\Users\gui_r\OneDrive\Documentos\faminas\ciencia de dados\trabalho\Atividade\vendas_limpo.csv'
df.to_csv(caminho_saida, index=False)
print(f"✅ Arquivo limpo salvo em: {caminho_saida}")
