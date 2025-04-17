import { getOrchestratorScripts } from '@/src/services/orchestrator';
export const getServerSideProps = async ({}) => {
    const aceScriptsConfig = getOrchestratorScripts();
    return {
        props: {
            aceScriptsConfig,
        },
    };
};
