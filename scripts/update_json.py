import datetime
import json
import numpy as np
import pandas as pd


JSON_PATH = "../public/data/table.json"
csv_path = "../public/data/table.csv"


def default(obj):
    if isinstance(
        obj,
        (
            np.int_,
            np.intc,
            np.intp,
            np.int8,
            np.int16,
            np.int32,
            np.int64,
            np.uint8,
            np.uint16,
            np.uint32,
            np.uint64,
        ),
    ):
        return int(obj)
    elif isinstance(obj, (np.float_, np.float16, np.float32, np.float64)):
        return float(obj)
    elif isinstance(obj, (np.complex_, np.complex64, np.complex128)):
        return {"real": obj.real, "imag": obj.imag}
    elif isinstance(obj, (np.ndarray,)):
        return obj.tolist()
    elif isinstance(obj, (np.bool_)):
        return bool(obj)
    elif isinstance(obj, (np.void)):
        return None
    return json.JSONEncoder.default(obj)


def update_json():
    df = pd.read_json(JSON_PATH).replace(-1, np.nan)
    int_fields = [
        "context_length",
        "vocabulary_size",
        "nb_layers",
        "nb_heads",
        "nb_dimensions",
        "nb_ffn_layers",
    ]
    df = pd.read_csv(csv_path)
    df["release_date"] = df["release_date"].apply(
        lambda x: datetime.datetime.strptime(x, "%m/%d/%y")
    )
    df = df.sort_values(by="release_date", ascending=False)
    df["release_date"] = df["release_date"].apply(lambda x: x.strftime("%Y-%m-%d"))
    records = [
        {k: v for k, v in zip(df.columns, r.tolist())}
        for r in df.to_records(index=False)
    ]
    for i, record in enumerate(records):
        record_ = record.copy()
        for k, v in record.items():
            if pd.isna(v):
                record_.pop(k)
            else:
                if k in int_fields:
                    record_[k] = int(v)
        records[i] = record_

    with open(JSON_PATH, "w") as f:
        f.write(json.dumps(records, indent=2, default=default))


if __name__ == "__main__":
    update_json()
