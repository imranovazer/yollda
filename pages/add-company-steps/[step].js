import Head from "next/head";
import { useTranslation } from "next-i18next";

import Layout from "../../src/components/layout/Layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import SingleStep from "../../src/components/add-company-steps/SingleStep";

const StepPage = ({ error }) => {
  const { t } = useTranslation("common");

  return (
    <Layout isFleetLayout>
      <Head>
        <title>{`Yollda | ${t("navigation.add_company")}`}</title>
        <meta name="description" content={t("meta_descriptions.add_company")} />
      </Head>
      <SingleStep />
    </Layout>
  );
};


export async function getServerSideProps({ params, locale }) {
  const { step } = params;

  try {
    return {
      props: {
        ...(await serverSideTranslations(locale, ["common"])),
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);

    return {
      props: {
        ...(await serverSideTranslations(locale, ["common"])),

        error: "Failed to load data.",
      },
    };
  }
}
export default StepPage;
