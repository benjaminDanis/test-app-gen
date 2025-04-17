// import '@/styles/globals.css';
import '@/styles/styles.scss';
import { Main, App as MainApp, Layout as MainLayout } from '@newscorp-djcs/sonata-react';
import { DynamicInsetLegacyScripts } from '@newscorp-ghfb/dj-dynamic-inset';
import { createTheme } from 'newskit';
import PropTypes from 'prop-types';

export default function App({ Component, pageProps }) {
  const theme = createTheme({});

  return (
    <Main theme={theme}>
      <MainApp {...pageProps}>
        <DynamicInsetLegacyScripts />
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </MainApp>
    </Main>
  );
}

App.propTypes = {
    Component: PropTypes.elementType.isRequired,
    pageProps: PropTypes.shape({
        entitlements: PropTypes.object,
        encryption: PropTypes.shape({
            documentKey: PropTypes.string
        })
    }).isRequired
};