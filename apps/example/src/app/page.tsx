"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function Home() {
    const [formDefinition, setFormDefinition] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8000/form", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify([]),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setFormDefinition(data.form);
            });
    }, []);

    return (
        <div className={styles.page}>
            <h1>Example form</h1>
            <div>{JSON.stringify(formDefinition)}</div>
        </div>
    );
}
