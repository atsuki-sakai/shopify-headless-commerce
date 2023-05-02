import { Container, FaqDetail } from "@components/ui";
import React from "react";

const Guide = () => {
  return (
    <Container>
      <div className="px-8 py-6">
        <h1 className="text-lg font-bold">まぼろし屋 ご利用ガイド</h1>
        <div className="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 mt-12  md:mt-20">
          <div className="w-full lg:pr-4 lg:w-1/2">
            <FaqDetail
              questionText={"ストア構築にどのくらいの期間が必要ですか？"}
              answerText={
                "テンプレートをご用意しているため、商品写真や商品リストといった販売に必要な情報が揃えば、最短2週間でオープンすることも可能です。サイトの規模によっても変動しますので詳しくはお問い合わせください。"
              }
            />

            <FaqDetail
              questionText={"BASEとSTORESとShopifyの違いはなんですか？"}
              answerText={
                "初期費用、月額費用、販売手数料、クレジットカード手数料、商品登録数などが違います。BASE、STORESは国内企業のサービスですが、Shopifyはカナダの企業になります。取引手数料、決済手数料、入金手数料もっとも安いのがShopifyです。豊富なアプリがあり、低コスト＆スピーディーに機能の拡張をしやすいのが特長です。"
              }
            />

            <FaqDetail
              questionText={"構築費以外にかかる費用はありますか？"}
              answerText={
                "契約時に必ずお支払いいただく費用は、構築費(一回)のみとなっております。月額料金として選択したShopifyプランに応じて毎月請求されます。その他サポートプランに契約のお客様は選択したプランに応じて月額料金が発生します。"
              }
            />
          </div>
          <div className="w-full lg:pl-4 lg:w-1/2">
            <FaqDetail
              questionText={"利用可能な決済サービスはなんですか？"}
              answerText={
                "各種クレジットカード、Shopify ペイメント、Apple Pay、Google Pay、Shop Pay、PayPal、Amazon Pay、KOMOJU、携帯キャリア決済、Paidy、GMOイプシロン、SBペイメントサービス、2Checkout、CyberSource、BitPay殆どの決済に対応しています。"
              }
            />

            <FaqDetail
              questionText={"サポートプランは解約できますか？"}
              answerText={
                "マルチプラのご用意するサポートプランの契約期間については、最短2ヶ月から解約可能となっています。Shopifyサポート、広告運用支援サポートに関しては最低一年からのご契約となっております。"
              }
            />

            <FaqDetail
              questionText={"SNSと連携させて販売は出来ますか？"}
              answerText={
                "ShopifyではInstagramやFacebook、Amazonと連携することができるほか、LINEなどに購入ボタンをつける機能もございます。マルチプラではSNS連携の実績もございますので、お気軽にご相談ください。"
              }
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Guide;
