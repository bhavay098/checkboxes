import { useEffect, useState } from "react";
import Input from "./Input.jsx";
import socket from "./socket.js";

function App() {
  const [isDark, setIsDark] = useState(true);
  const [data, setData] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    const fetchState = async () => {
      try {
        const response = await fetch("http://localhost:8000/checkboxes");

        if (!response.ok) {
          throw new Error("Failed to fetch");
        }

        const data = await response.json();

        if (data && data.checkboxes) {
          setData(data.checkboxes);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchState();

    socket.connect();

    const handleCheckboxChange = (data) => {
      // console.log(`Socket server event`, data);
      const { index, checked } = data;

      setData((current) =>
        current.map((value, i) => (i === index ? checked : value)),
      );
    };

    socket.on("server:checkbox:change", handleCheckboxChange);

    let rateLimitTimerId;

    const handleRateLimit = ({ message }) => {
      setAlertMessage(message);
      setIsLocked(true);

      clearTimeout(rateLimitTimerId);

      rateLimitTimerId = setTimeout(() => {
        setIsLocked(false);
        setAlertMessage("");
      }, 2000);
    };

    socket.on("server:rate-limit", handleRateLimit);

    return () => {
      socket.off("server:checkbox:change", handleCheckboxChange);
      socket.off("server:rate-limit", handleRateLimit);
      socket.disconnect();
      clearTimeout(rateLimitTimerId);
    };
  }, []);

  const onChange = (event, index) => {
    if (isLocked) return;
    const checked = event.target.checked;

    socket.emit("client:checkbox:change", { index, checked });
  };

  return (
    <main
      className={`min-h-screen transition-colors duration-200 ${
        isDark ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900"
      }`}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header
          className={`mb-6 flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between ${
            isDark ? "border-slate-800" : "border-slate-200"
          }`}
        >
          <div>
            <h1
              className={`mt-2 text-2xl font-semibold tracking-tight sm:text-3xl ${
                isDark ? "text-slate-50" : "text-slate-900"
              }`}
            >
              Checkboxes
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setIsDark((current) => !current)}
            className={`inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isDark
                ? "border-slate-700 bg-slate-900 text-slate-100 hover:border-slate-600 hover:bg-slate-800 focus:ring-slate-400 focus:ring-offset-slate-950"
                : "border-slate-300 bg-white text-slate-900 hover:border-slate-400 hover:bg-slate-50 focus:ring-slate-400 focus:ring-offset-slate-100"
            }`}
          >
            {isDark ? "Switch to light" : "Switch to dark"}
          </button>
        </header>

        {alertMessage ? (
          <div
            role="alert"
            className={`mb-4 rounded-xl border px-4 py-3 text-sm font-medium ${
              isDark
                ? "border-rose-900/60 bg-rose-950 text-rose-200"
                : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
          >
            {alertMessage}
          </div>
        ) : null}

        <section
          className={`flex-1 rounded-2xl border p-4 shadow-sm sm:p-6 ${
            isDark
              ? "border-slate-800 bg-slate-900"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="grid grid-cols-6 gap-3 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-16 xl:grid-cols-20">
            {data.map((serverValue, index) => (
              <Input
                isDark={isDark}
                onChange={(event) => onChange(event, index)}
                id={index}
                checked={serverValue}
                disabled={isLocked}
                key={index}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
