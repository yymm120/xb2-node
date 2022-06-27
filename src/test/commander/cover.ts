const YAML = require('yaml');
const _ = require('lodash');
const fs = require('fs')
const os = require('os')

/**
 * Configuration strategy
 * @param yamlPath
 * @Author xinhaoluo
 */
class ConfigUtil {
    public baseConfig = null;
    public extendConfig = null;
    public parentNode = '';

    public cover(baseConfig: any, extendConfig: any) {
        if (baseConfig instanceof String && fs.exists(baseConfig)){
            this.baseConfig = this.readYaml(baseConfig);
        }else{
            this.baseConfig = baseConfig;
        }
        if (extendConfig instanceof String && fs.exists(extendConfig)){
            this.extendConfig = this.readYaml(extendConfig);
        }else{
            this.extendConfig = extendConfig;
        }
        if (Object.entries(this.baseConfig)[0][1] instanceof Object){
            this.parentNode = Object.entries(this.baseConfig)[0][0];
            this.baseConfig = this.baseConfig[`${this.parentNode}`];
        }
        if (Object.entries(this.extendConfig)[0][1] instanceof Object){
            let tempName = Object.entries(this.extendConfig)[0][0];
            this.extendConfig = this.extendConfig[`${tempName}`];
        }

        this.coverConfig()
        return this.baseConfig;
    }

    /**
     * Only handle Object, not array
     */
    private coverConfig(pn=this.parentNode, bc=this.baseConfig, ec=this.extendConfig) {
        for (let ic of Object.entries(ec)) {
            let currentNode = (pn + '.' + ic[0]).replace(/^\./, '');
            console.log(currentNode);
            if (ic[1] instanceof Object)
                this.coverConfig(currentNode, bc, ic[1])
            else
                _.update(bc, `${currentNode}`, () => { return ic[1] })
        }
    }

    public readYaml(yamlPath) {
        let configFile = fs.readFileSync(yamlPath, 'utf-8');
        return YAML.parse(configFile);
    }
}
export let configUtil = new ConfigUtil();