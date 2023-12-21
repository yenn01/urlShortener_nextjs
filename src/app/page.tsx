import Image from "next/image";
import styles from "./page.module.css";
import Login from "@/app/components/login/Login";
import Shorter from "./components/shorter/Shorter";
import QueryProvider from "@/react_query/Provider";

export default function Home() {
  return (
    <QueryProvider>
      <main className={styles.main}>
        <div className={styles.header}>
          <Image
            src="/logo.png"
            width={200}
            height={62}
            alt="Shorter Logo"
          ></Image>
          <Login></Login>
        </div>
        <div className={styles.content}>
          <Shorter></Shorter>
        </div>
        <div className={styles.footer}>By Yenn Miing</div>
      </main>
    </QueryProvider>
  );
}
