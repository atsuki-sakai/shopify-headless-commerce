import { Container } from "@components/ui";
import React from "react";

const AboutUs = () => {
  const datas = {
    company: "まぼろし屋",
    address: "丹波篠山市今田町下小野原59−45",
    dateOfEstablishment: "2022年02月12日",
    ceo: "数元伸哉",
    capital: "30万円",
  };
  return (
    <Container>
      <div className="px-8 pt-12 max-w-2xl mx-auto">
        <h1 className="font-bold text-xl">会社概要</h1>
        <p className="text-xs text-gray-500">ABOUT US</p>
        <div className="py-16 space-y-2">
          <div className="flex items-center space-x-3">
            <p className="font-bold">会社名</p>
            <p className="text-gray-500 text-sm">{datas.company}</p>
          </div>
          <div className="flex items-center space-x-3">
            <p className="font-bold">住所</p>
            <p className="text-gray-500 text-sm">{datas.address}</p>
          </div>
          <div className="flex items-center space-x-3">
            <p className="font-bold">設立日</p>
            <p className="text-gray-500 text-sm">{datas.dateOfEstablishment}</p>
          </div>
          <div className="flex items-center space-x-3">
            <p className="font-bold">代表</p>
            <p className="text-gray-500 text-sm">{datas.ceo}</p>
          </div>
          <div className="flex items-center space-x-3">
            <p className="font-bold">資本金</p>
            <p className="text-gray-500 text-sm">{datas.capital}</p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AboutUs;
