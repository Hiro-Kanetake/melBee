import React, { useEffect, useState } from "react";
import Template from "../molecules/Template";
import axios, { AxiosResponse, AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

type template = {
  id: number;
  thumbnail: string;
  title: string;
};

const TemplateBox: React.FC = () => {
  const [melBeeTemplates, setMelBeeTemplates] = useState<template []>([]);
  const [myTemplates, setMyTemplates] = useState<template []>([]);
  const [fetchTemplate, setFetchTemplate] = useState<boolean>(false);
  // const [loading, setLoading] = useState<boolean>(true);
  const BASE_URL = process.env.REACT_APP_PUBLIC_URL || "http://localhost:8000";
  const navigate = useNavigate();

  const numOfTemplates = 4;
  const seedTemplate = () => {
    axios({
      method: "post",
      url: `${BASE_URL}/template/seed`,
      data: "tomatoTest",
    });
    for (let i = 1; i <= numOfTemplates; i++) {
      getTemplate(i);
    };
  };

  const getTemplate = (id: number) => {
    axios({
      method: "get",
      url: `${BASE_URL}/template/${id}`,
    })
      .then((res: AxiosResponse) => {
        let data = res.data;
        data.id = id;
        setMelBeeTemplates((current) => [...current, data]);
      })
      .catch((err: AxiosError<{ error: string }>) => {
        console.log(err.response!.data);
      });
  };

  const getSavedTemplate = () => {
    axios({
      method: "get",
      url: `${BASE_URL}/user/${sessionStorage.melbeeID}/template`,
    })
      .then((res: AxiosResponse) => {
        let data = res.data;
        data.map((template: template) => {
          setMyTemplates((current) => [template, ...current]);
        });
      })
      .catch((err: AxiosError<{ error: string }>) => {
        console.log(err.response!.data);
      });
  };

  useEffect(() => {
    seedTemplate();
    getSavedTemplate();
    setFetchTemplate(true);
  }, []);

  // TODO: if possible, render a loading component until the fetching is done.
  // useEffect(() => {
  //   setLoading(false);
  // }, [fetchTemplate]);

  const handleMyTemplate = (i: number) => {
    axios({
      method: "get",
      url: `${BASE_URL}/user/${sessionStorage.melbeeID}/template`,
    })
    .then((res: AxiosResponse) => {
      let data = res.data;
      localStorage.setItem("melBeeTempStoragedraft", data[i].body);
    })
    .then(() => navigate("/user/edit"));
  };

  const handleMelBeeTemplate = (i: number) => {
    const templateId = melBeeTemplates[i].id;
    axios({
      method: "get",
      url: `${BASE_URL}/template/${templateId}`,
    })
    .then((res) => {
      const data = res.data;
      localStorage.setItem("melBeeTempStoragedraft", data.body);
    })
    .then(() => navigate("/user/edit"));
  };

  return (
    <div className="bg-white w-screen mx-80">
      <h3>テンプレートをお選びください</h3>
      <div className="px-5 py-3 mx-20">
        カスタマイズされたテンプレート
        <div className="grid gap-4 grid-cols-4">
          {myTemplates.map((template, i) => {
            return (
              <a key={`myTemp${i}`} onClick={(e)=> {
                e.preventDefault();
                handleMyTemplate(i)}}>
                <Template template={template} />
              </a>
            )
          })}
        </div>
        melBee テンプレート
        <div className="grid gap-4 grid-cols-4">
          {melBeeTemplates.map((template, i) => {
            return (
              <a key={`mbTemp${i}`} onClick={(e)=> {
                e.preventDefault();
                handleMelBeeTemplate(i)}}>
                <Template template={template} />
              </a>
            ) 
          })}
        </div>
      </div>
    </div>
  );
};

export default TemplateBox;
