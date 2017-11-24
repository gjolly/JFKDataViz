import pandas as pd
import numpy as np

df = pd.read_csv("data.csv")
df = df.rename(columns={"To Name": "To"})
actual_col = df.columns
df = (df['To'].str.split('/', expand=True)
      .stack()
      .reset_index(level=0)
      .set_index('level_0')
      .rename(columns={0: 'To'})
      .join(df.drop('To', 1), how='left')
      )
df = df[actual_col]
df.head(5)
to = df["To"].str.lower()
len(to.groupby(to))  # 3461
symbol = '|'.join(['\,', '\.', '\:', '\;'])
to = to.str.replace(symbol, " ").str.replace('\s+', ' ')
len(to.groupby(to))  # 3275
stop_words = '|'.join(['to ', 'the ', 'of ', 'for '])
to = to.str.replace(stop_words, " ").str.replace('\s+', ' ')
len(to.groupby(to))  # 3260
temp = to.str.contains('\(', na=False)
to = to.str.replace('\(.*\)', '').str.replace('\s+', ' ')
to = to.str.replace('\[.*\]', '').str.replace('\s+', ' ')
to = to.str.replace('\(.*$', '').str.replace('\s+', ' ')
len(to.groupby(to))  # 3238
to = to.replace('', 'none')
syno = {}
syno['fbi'] = '|'.join(['federal bureau', 'federal bureau investi',
                        'federal bureau investigation'])
syno['cia'] = '|'.join(['central intelligence', 'central intelligence agency'])
for i in syno:
    to = to.str.replace(syno[i], i)
len(to.groupby(to))
to = to.str.replace("^.{1}$", 'none')
len(to.groupby(to))
df['To'] = to

from_ = df["From Name"].str.lower()
len(from_.groupby(from_))  # 4122
symbol = '|'.join(['\,', '\.', '\:', '\;'])
from_ = from_.str.replace(symbol, " ").str.replace('\s+', ' ')
len(from_.groupby(from_))  # 3923
stop_words = '|'.join(['to ', 'the ', 'of ', 'for '])
from_ = from_.str.replace(stop_words, " ").str.replace('\s+', ' ')
len(from_.groupby(from_))  # 3905
temp = from_.str.contains('\(', na=False)
from_ = from_.str.replace('\(.*\)', '').str.replace('\s+', ' ')
from_ = from_.str.replace('\[.*\]', '').str.replace('\s+', ' ')
from_ = from_.str.replace('\(.*$', '').str.replace('\s+', ' ')
len(from_.groupby(from_))  # 38
from_ = from_.replace('', 'none')
syno = {}
syno['fbi'] = '|'.join(['federal bureau', 'federal bureau investi',
                        'federal bureau investigation'])
syno['cia'] = '|'.join(['central intelligence', 'central intelligence agency'])
for i in syno:
    from_ = from_.str.replace(syno[i], i)
len(from_.groupby(from_))
df["From Name"] = from_

df.to_csv("data_treated.csv", index=False)
