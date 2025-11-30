import pandas as pd
import numpy as np
import argparse
import pickle
from sklearn.ensemble import RandomForestRegressor, IsolationForest
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


def load_dataframe(path):
    df = pd.read_csv(path, header=None, names=["pid","tid","syscall_id","latency_us"])
    df["pid"] = df["pid"].astype(int)
    df["tid"] = df["tid"].astype(int)
    df["syscall_id"] = df["syscall_id"].astype(int)
    df["latency_us"] = df["latency_us"].astype(float)
    return df


def add_features(df):
    df["latency_prev1"] = df["latency_us"].shift(1).fillna(df["latency_us"].median())
    df["latency_prev2"] = df["latency_us"].shift(2).fillna(df["latency_us"].median())

    df["delta"] = df["latency_prev1"] - df["latency_prev2"]
    df["delta_idx"] = np.where(df["delta"] >= 0, 1, 0)
    df["inv_delta"] = 1.0 / (np.abs(df["delta"]) + 1.0)

    df["cpu_usage"] = np.random.uniform(1, 100, len(df))
    df["mem_usage"] = np.random.uniform(1, 100, len(df))
    df["syscall_rate"] = np.random.uniform(1, 1000, len(df))

    return df


def train_models(df, out_model, out_anom):
    FEATURES = [
        "pid","tid","syscall_id",
        "latency_prev1","latency_prev2",
        "delta_idx","inv_delta",
        "cpu_usage","mem_usage","syscall_rate",
        "latency_us"
    ]

    target = "latency_us"

    X = df[FEATURES[:-1]]
    y = df[target]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = RandomForestRegressor(n_estimators=200, random_state=42)
    model.fit(X_train, y_train)

    pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, pred)
    rmse = mean_squared_error(y_test, pred, squared=False)
    r2 = r2_score(y_test, pred)

    print(f"[METRICS] MAE: {mae:.3f}, RMSE: {rmse:.3f}, R2: {r2:.3f}")

    with open(out_model, "wb") as f:
        pickle.dump(model, f)

    anom = IsolationForest(contamination=0.01, random_state=42)
    anom.fit(X)

    with open(out_anom, "wb") as f:
        pickle.dump(anom, f)

    print("[INFO] Models saved successfully.")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--out", required=True)
    parser.add_argument("--anom", required=True)
    args = parser.parse_args()

    df = load_dataframe(args.input)
    df = add_features(df)
    train_models(df, args.out, args.anom)


if __name__ == "__main__":
    main()
