import React from 'react';
import 'draft-js/dist/Draft.css';
import '../style/tailwind.css'
import 'antd/dist/reset.css';
import "../style/main.scss";
import { useRouter } from 'next/router';
import { ConfigProvider } from 'antd'
import frFR from 'antd/locale/fr_FR';
import enGB from 'antd/locale/en_GB';
import { appWithTranslation } from 'next-i18next';
import { Provider } from 'react-redux';

import { ProvideAuth } from '../database/auth'
import { store } from '../database/rtkStore'
import Layout from '../components/common/Layout';
import { ProvideNotification } from '../database/notifications';

// TODO - ADD RULES ON FIREBASE
// TODO - ADSENSE
// TODO - CHANGE FOR APP AND GET TOKEN FROM LAYOUT

// V2
// TODO - NEWSLETTER HOME CTA
// TODO - YOU MAY ALSO LIKE SECTION
// TODO - SERIES MANAGER
// TODO - MAIN MENU BUTTON

const MyApp = ({ Component, pageProps }) => {
  const [darkTheme, setDarkTheme] = React.useState(false)
  const { locale, events } = useRouter()

  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    setDarkTheme(typeof window !== 'undefined' && localStorage.getItem('darkTheme') ? JSON.parse(localStorage.getItem('darkTheme')) : false);

    const start = () => {
      setLoading(true);
    };
    const end = () => {
      setLoading(false);
    };
    events.on("routeChangeStart", start);
    events.on("routeChangeComplete", end);
    events.on("routeChangeError", end);
    return () => {
      events.off("routeChangeStart", start);
      events.off("routeChangeComplete", end);
      events.off("routeChangeError", end);
    };
  }, []);

  React.useEffect(() => {
    darkTheme ? document.body.classList.add("bg-zinc-800") : document.body.classList.remove("bg-zinc-800")
    darkTheme ? document.body.classList.add("text-slate-100") : document.body.classList.remove("text-slate-100")
    darkTheme ? document.body.classList.remove("bg-slate-50") : document.body.classList.add("bg-slate-50")
    darkTheme ? document.body.classList.remove("text-zinc-900") : document.body.classList.add("text-zinc-900")
  }, [darkTheme])

  return (
    <Provider store={store}>
      <ProvideAuth>
        <ProvideNotification>
          <ConfigProvider locale={locale === "fr" ? frFR : enGB} theme={{
            token: {
              colorPrimary: '#27746c',
            },
          }}>
            <Layout darkTheme={darkTheme} setDarkTheme={setDarkTheme}>
              <Component isLoading={loading} darkTheme={darkTheme} {...pageProps} />
            </Layout>
          </ConfigProvider>
        </ProvideNotification>
      </ProvideAuth>
    </Provider>
  )
}

export default appWithTranslation(MyApp)
