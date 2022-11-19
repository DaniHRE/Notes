import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { stringify } from "querystring";
import { useState } from "react";
import { Card } from "../components/card";
import { prisma } from "../lib/prisma";

interface Notes {
  notes: {
    id: string;
    title: string;
    content: string;
  }[];
}

export interface FormData {
  title: string;
  content: string;
  id: string;
}

export default function Home({ notes }: Notes) {
  const [form, setForm] = useState<FormData>({
    title: "",
    content: "",
    id: "",
  });
  const [popUp, setPopUp] = useState(false)
  const router = useRouter();

  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    if (darkMode === true) {
      return (
        <button onClick={() => setDarkMode(false)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="transition duration-500 ease-in-out text-gray-200 ml-6 hover:text-gray-400 mt-6 p-3 w-14 rounded-lg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
            />
          </svg>
        </button>
      );
    } else {
      return (
        <button onClick={() => setDarkMode(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="transition duration-500 ease-in-out text-black hover:text-gray-600 mt-6 ml-6 p-3 w-14 rounded-lg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
            />
          </svg>
        </button>
      );
    }
  };

  const refreshData = () => {
    router.replace(router.asPath);
  };

  async function create(data: FormData) {
    if (data.content === "" || data.title === "") {
      setPopUp(true)
    } else {
      try {
        fetch("/api/create", {
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        }).then(() => {
          if (data.id) {
            deleteNote(data.id);
            setForm({ title: "", content: "", id: "" });
            refreshData();
          } else {
            setForm({ title: "", content: "", id: "" });
            refreshData();
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function deleteNote(id: string) {
    try {
      fetch(`/api/note/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
      }).then(() => {
        refreshData();
      });
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmit = async (data: FormData) => {
    try {
      create(data);
    } catch (error) {
      console.log(error);
    }
  };

  function popMessage(){
      if (popUp){
        timer()
        return <div className="fixed lg:absolute transition duration-700 p-2 ease-in-out lg:px-10 lg:py-6 lg:top-10 rounded-b-sm lg:rounded-sm lg:right-3 dark:border-red-600 border-red-500 lg:border-r-[10px] dark:bg-red-600 bg-red-400 lg:dark:bg-slate-800 lg:bg-slate-200 font-bold dark:text-slate-50 text-slate-800">O titulo ou o corpo da mensagem não podem ser vazios!</div>
      }
      else{
        null
      }
  }

  function timer(){
    setTimeout(() => {
      setPopUp(false);
  }, 6000);
  }

  return (
    <div className={` ${darkMode && "dark"}`}>
      <title>Ventura Notes</title>
      {popMessage()}
      <div
        className="transition duration-700 ease-in-out min-h-screen bg-gray-100 dark:bg-slate-900">
        {toggleDarkMode()}
        <h1 className="transition duration-700 ease-in-out text-center dark:text-white font-bold text-2xl">
          Notes
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(form);
          }}
          className="w-auto mt-6 min-w-[25%] max-w-min mx-auto space-y-6 flex flex-col items-stretch"
        >
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="transition duration-700 ease-in-out border-2 rounded border-gray-600 p-2 border-gray-500 dark:text-gray-200 dark:bg-slate-800"
          />
          <textarea
            placeholder="Content"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="transition duration-700 ease-in-out resize-none h-28 border-2 rounded border-gray-600 p-2 border-gray-500 dark:text-gray-200 dark:bg-slate-800"
          />

          <button type="submit" className="bg-blue-500 hover:bg-blue-600 duration-500 text-white rounded p-1">
            Add +
          </button>
        </form>
        
        <div className="transition duration-700 ease-in-out w-auto min-w-[25%] max-w-min mt-20 mx-auto space-y-6 flex flex-col items-stretch dark:text-gray-200">
          <div className="mb-12">
            {notes.map((note) => (
                <Card note={note} setForm={setForm} deleteNote={deleteNote} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const notes = await prisma.note.findMany({
    select: {
      title: true,
      id: true,
      content: true,
    },
  });

  return {
    props: {
      notes,
    },
  };
};
