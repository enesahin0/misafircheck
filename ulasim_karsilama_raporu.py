
import streamlit as st
import pandas as pd

st.set_page_config(page_title="Ulaşım Karşılama Raporu", layout="wide")
st.title("📋 Ulaşım Geliş-Dönüş Raporu")

uploaded_file = st.file_uploader("Excel dosyasını yükleyin (.xlsx)", type=["xlsx"])

if uploaded_file:
    df = pd.read_excel(uploaded_file)
    df.columns = df.columns.str.strip()  # Remove extra spaces in column names

    df["Geliş Tarihi"] = pd.to_datetime(df["Geliş Tarihi"])
    df["Dönüş Günü"] = pd.to_datetime(df["Dönüş Günü"])

    # Arrival details
    arrival_details = df[["Geliş Tarihi", "Konuk Adı ve Soyadı", "İniş Saati"]].copy()
    arrival_details.columns = ["Tarih", "İsim", "Saat"]
    grouped_arrival = arrival_details.groupby("Tarih").apply(
        lambda x: x[["İsim", "Saat"]].to_dict("records")
    ).reset_index(name="Gelenler")

    max_arrivals = grouped_arrival["Gelenler"].apply(len).max()
    for i in range(max_arrivals):
        grouped_arrival[f"İsim {i+1}"] = grouped_arrival["Gelenler"].apply(
            lambda x: x[i]["İsim"] if i < len(x) else ""
        )
        grouped_arrival[f"Saat {i+1}"] = grouped_arrival["Gelenler"].apply(
            lambda x: x[i]["Saat"] if i < len(x) else ""
        )
    grouped_arrival.drop(columns=["Gelenler"], inplace=True)

    # Departure details
    departure_details = df[["Dönüş Günü", "Konuk Adı ve Soyadı", "Dönüş Saati"]].copy()
    departure_details.columns = ["Tarih", "İsim", "Saat"]
    grouped_departure = departure_details.groupby("Tarih").apply(
        lambda x: x[["İsim", "Saat"]].to_dict("records")
    ).reset_index(name="Gidenler")

    max_departures = grouped_departure["Gidenler"].apply(len).max()
    for i in range(max_departures):
        grouped_departure[f"İsim {i+1}"] = grouped_departure["Gidenler"].apply(
            lambda x: x[i]["İsim"] if i < len(x) else ""
        )
        grouped_departure[f"Saat {i+1}"] = grouped_departure["Gidenler"].apply(
            lambda x: x[i]["Saat"] if i < len(x) else ""
        )
    grouped_departure.drop(columns=["Gidenler"], inplace=True)

    st.subheader("🟩 Geliş Grupları")
    st.dataframe(grouped_arrival, use_container_width=True)

    st.subheader("🟥 Dönüş Grupları")
    st.dataframe(grouped_departure, use_container_width=True)
