"use client";

import { Spinner } from "@/components/Spinner";
import { infoAlert } from "@/components/ToastGroup";
import UserContext from "@/context/UserContext";
import { useSocket } from "@/contexts/SocketContext";
import { coinInfo } from "@/utils/types";
import { createNewCoin, uploadImage } from "@/utils/util";
import Link from "next/link";
import {
  ChangeEvent,
  useContext,
  useEffect,
  useState,
} from "react";

export default function CreateCoin() {
  const { user, imageUrl, setImageUrl, isCreated, setIsCreated } =
    useContext(UserContext);
  const { isLoading, setIsLoading, alertState } = useSocket();
  const [newCoin, setNewCoin] = useState<coinInfo>({} as coinInfo);
  const [isCreate, setIsCreate] = useState(false);
  const [visible, setVisible] = useState<Boolean>(false);
  const [selectedFileName, setSelectedFileName] = useState("");

  useEffect(() => {
    if (
      newCoin.name !== undefined &&
      newCoin.creator !== undefined &&
      typeof newCoin.marketcap === "number" &&
      typeof newCoin.replies === "number" &&
      newCoin.ticker !== undefined
    )
      setIsCreate(true);
  }, [newCoin]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setNewCoin({ ...newCoin, [e.target.id]: e.target.value });
  };

  const createCoin = async () => {
    if (imageUrl) {
      setIsLoading(true);
      const url = await uploadImage(imageUrl);
      infoAlert(`Uploaded Image for ${newCoin.name}`)
      if (url && user._id) {
        const coin: coinInfo = {
          ...newCoin,
          creator: user._id.toString(),
          url: url,
        };
        const created = await createNewCoin(coin);
        setIsCreated(created);
        setNewCoin({} as coinInfo);
      }
    } else {
      console.error("Image URL is not defined");
    }
  };


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };
  return (
    <div className=" w-[500px] m-auto ">
      <Link href="/">
        <h1 className=" text-center font-normal hover:font-bold m-auto  cursor-pointer ">
          [go back]
        </h1>
      </Link>
      {isLoading && Spinner()}
      <div className=" pt-[20px] m-auto">
        <label
          htmlFor="name  py-[20px]"
          className="block mb-2 text-sm font-medium text-white"
        >
          name*
        </label>
        <input
          type="text"
          id="name"
          value={newCoin.name}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="name"
          required
        />
      </div>
      <div className="pt-[20px] m-auto">
        <label
          htmlFor="ticker py-[20px]"
          className="block mb-2 text-sm font-medium text-white"
        >
          ticker*
        </label>
        <input
          type="text"
          id="ticker"
          value={newCoin.ticker}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="ticker"
          required
        />
      </div>
      <div className=" pt-[20px] m-auto">
        <label
          htmlFor="description  py-[20px]"
          className="block mb-2 text-sm font-medium text-white"
        >
          description
        </label>
        <textarea
          id="description"
          value={newCoin.description}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="description"
          required
        />
      </div>
      <div className="mt-[20px] m-auto bg-white pt-2 rounded-lg">
        <input
          type="file"
          className="ml-2 mb-2"
          onChange={handleFileChange}
          multiple
        />
      </div>
      <div className="font-xl m-auto mt-5 w-24 ">
        <h1
          className="hover:text-gray-400 cursor-pointer text-white"
          onClick={() => setVisible(!visible)}
        >
          more option
        </h1>
      </div>
      {visible && (
        <>
          <div className=" m-auto">
            <label
              htmlFor="twitter py-[20px]"
              className="block mb-2 text-sm font-medium text-white"
            >
              Twitter
            </label>
            <input
              type="text"
              id="twitter"
              value={newCoin.twitter}
              onChange={handleChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Optional"
              required
            />
          </div>
        </>
      )}
      <div>
        <button
          className=" mt-[20px] active:bg-slate-900 m-auto rounded-lg bg-blue-700 hover: text-center py-2 w-full"
          onClick={createCoin}
          disabled={isCreate}
        >
          create coin
        </button>
      </div>
    </div>
  );
}
