import { RenovateConfig } from '../../../config';
import { logger } from '../../../logger';
import { clone } from '../../../util/clone';
import { setBranchPrefix } from '../../../util/git';
import { checkIfConfigured } from '../configured';
import { initApis } from './apis';
import { initializeCaches } from './cache';
import { getRepoConfig } from './config';
import { detectVulnerabilityAlerts } from './vulnerability';

function initializeConfig(config: RenovateConfig): RenovateConfig {
  return { ...clone(config), errors: [], warnings: [], branchList: [] };
}

export async function initRepo(
  config_: RenovateConfig
): Promise<RenovateConfig> {
  let config: RenovateConfig = initializeConfig(config_);
  await initializeCaches(config);
  config = await initApis(config);
  config = await getRepoConfig(config);
  checkIfConfigured(config);
  await setBranchPrefix(config.branchPrefix);
  config = await detectVulnerabilityAlerts(config);
  // istanbul ignore if
  if (config.printConfig) {
    logger.debug({ config }, 'Full resolved config including presets');
  }
  return config;
}
