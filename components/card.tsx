import { Dispatch, SetStateAction, useState } from "react";
import { FormData } from "../pages";
import { Modal } from "./modal";

export interface cardProps {
  note: {
    id: string;
    title: string;
    content: string;
  };
  deleteNote: any;
  setForm: Dispatch<SetStateAction<FormData>>;
}

export function Card({ note, setForm, deleteNote }: cardProps) {
  const [modalComponent, setModalComponent] = useState(false);
  let thereMore = ''

  function verifyLengthContent() {
    if (note.content.length > 63){
      thereMore = 'See More...'
    }else{
      null
    }
    console.log(thereMore)
  }

  function callModal() {
    if (modalComponent === true) {
      return <Modal note={note} />;
    } else {
      null;
    }
  }

  return (
    <>
    {verifyLengthContent()}
      <li key={note.id} className="border-b border-gray-600 p-2">
        <div
          onClick={() => setModalComponent(!modalComponent)}
          className="cursor-pointer flex justify-between"
        >
          <div className="flex-1 h-12 overflow-hidden">
            <h3 className="font-bold">{note.title}</h3>
            <div className="flex">
            <p className="text-sm">
              {note.content}
            </p>
            <p className="w-10 lg:w-40 text-xs italic font-semibold lg:ml-10">{thereMore}</p>
            </div>
          </div>
          <button
            onClick={() =>
              setForm({
                title: note.title,
                content: note.content,
                id: note.id,
              })
            }
            className="bg-blue-500 hover:bg-blue-600 duration-500 mr-3 px-3 text-white rounded"
          >
            Update
          </button>
          <button
            onClick={() => deleteNote(note.id)}
            className="bg-red-500 hover:bg-red-600 duration-500 px-3 text-white rounded"
          >
            X
          </button>
          {callModal()}
        </div>
      </li>
    </>
  );
}
