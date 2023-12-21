import styles from "./linkHolder.module.css";

export type linkProp = {
  url: string;
};

export default function LinkHolder(_props: linkProp) {
  const host = window.location.host;
  const link = host + "/route/" + _props.url;
  return (
    <div className={styles.linkHolder}>
      {link}
      <button
        className={styles.copyButton}
        onClick={(e) => {
          e.preventDefault();
          navigator.clipboard.writeText(link);
          alert("Copied to clipboard");
        }}
      >
        <div className={styles.copyButtonBackground}>
          <p>Copy</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
            />
          </svg>
        </div>
      </button>
    </div>
  );
}
