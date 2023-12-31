import React, { useEffect } from "react";
import App from "next/app";
import Head from "next/head";
import AOS from "aos";

//REDUX
import { Provider } from "react-redux";
import { createFirestoreInstance } from "redux-firestore";
import { ReactReduxFirebaseProvider } from "react-redux-firebase";
import firebase from "firebase/app";
import { wrapper, newStore } from "../redux/store";
import { ProvideAuth } from "../hooks/userHooks";

import "../style/custom-antd.less";
import "aos/dist/aos.css";
import "../style/main.scss";

import Layout from "../components/common/Layout";
import { ProvideNotification } from "../hooks/notificationsHooks";

const MyApp = ({ Component, pageProps }) => {
  const rrfConfig = { userProfile: "users", useFirestoreForProfile: true };

  const store = newStore();
  const rrfProps = {
    firebase,
    config: rrfConfig,
    dispatch: store.dispatch,
    createFirestoreInstance,
  };

  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
    });
  }, []);

  return (
    <>
      <Head>
        <script
          type="module"
          src="https://unpkg.com/ionicons@5.4.0/dist/ionicons/ionicons.esm.js"
        ></script>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        <meta charset="utf-8" />
      </Head>
      <Provider store={store}>
        <ReactReduxFirebaseProvider {...rrfProps}>
          <ProvideAuth>
            <ProvideNotification>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ProvideNotification>
          </ProvideAuth>
        </ReactReduxFirebaseProvider>
      </Provider>
    </>
  );
};

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps };
};

export default wrapper.withRedux(MyApp);
