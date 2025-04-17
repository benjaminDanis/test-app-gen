import { DocumentTagGenerator } from '@newscorp-djcs/sonata-react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import PropTypes from 'prop-types';

import { getOrchestratorScripts } from '@/src/services/orchestrator';

class SpaDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    const nextData = ctx.renderPage().props;
    const aceScriptsConfig = getOrchestratorScripts({ path: ctx?.pathname });
    return { ...initialProps, nextData, aceScriptsConfig };
  }

  render() {
    const { aceScriptsConfig } = this.props;
    return (
      <Html lang="en">
        <Head>
          <DocumentTagGenerator configOptions={aceScriptsConfig} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

SpaDocument.propTypes = {
  aceScriptsConfig: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default SpaDocument;
