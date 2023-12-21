"use client";
import { createShortURL } from "@/firebase/firestore/db";
import { RootState, useAppSelector } from "@/redux/store";
import styles from "./shorter.module.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { usePathname } from "next/navigation";
import LinkHolder from "../links/LinkHolder";

export default function Shorter() {
  const [value, setValue] = useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setValue(event.target.value);

  async function createSURL(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("SURL CREATED");
    const response = await fetch("/api/createSURL", {
      method: "POST",
      body: new FormData(event.target as HTMLFormElement),
    });
    mutate(event);
    console.log(response.json());
  }

  const { data, mutate, isIdle, isError, isSuccess, isPending } = useMutation({
    mutationFn: async (event: React.FormEvent<HTMLFormElement>) => {
      return getSURLs(event);
    },
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    mutate(event);
    console.log(data);
  }

  async function getSURLs(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/checkSURL", {
      method: "POST",
      body: new FormData(event.target as HTMLFormElement),
    });
    return response.json();
  }

  if (isIdle) {
    return (
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          name="longurl"
          id="longurl"
          type="text"
          placeholder="Shorten your link"
          value={value}
          onChange={handleChange}
        />
        <button type="submit">Shorten</button>
      </form>
    );
  }

  function shortForm() {
    return (
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          name="longurl"
          id="longurl"
          type="text"
          placeholder="Shorten your link"
          value={value}
          onChange={handleChange}
        />
        <button type="submit">Shorten</button>
      </form>
    );
  }

  if (isPending) {
    return [shortForm(), <div key="pending">Loading...</div>];
  }

  if (isError) {
    return [shortForm(), <div key="error">Error finding short url</div>];
  }

  if (isSuccess) {
    if (data.surls === undefined || data.surls.length === 0) {
      return (
        <form onSubmit={createSURL} className={styles.form}>
          <input
            name="longurl"
            id="longurl"
            type="text"
            placeholder="Shorten your link"
            value={value}
            onChange={handleChange}
          />

          <div>No short urls found</div>
          <button type="submit">Create</button>
        </form>
      );
    }

    data.surls.map((element: any) => {
      console.log(Object.keys(element)[0]);
    });
    return (
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          name="longurl"
          id="longurl"
          type="text"
          placeholder="Shorten your link"
          value={value}
          onChange={handleChange}
        />
        <button type="submit">Shorten</button>
        <div>
          {data.surls.map((element: any) => {
            return (
              <div
                key={Object.keys(element)[0]}
                className={styles.linkHolderParent}
              >
                <LinkHolder url={Object.keys(element)[0]}></LinkHolder>
              </div>
            );
          })}
        </div>
      </form>
    );
  }
}
