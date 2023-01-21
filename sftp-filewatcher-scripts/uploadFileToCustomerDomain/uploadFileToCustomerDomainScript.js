
const fs                     = require('fs');

const path                   = require('path');

const Client                 = require('ssh2-sftp-client');




async function uploadFileToCustomerDomain(_file, _domainConfig) {

    try {

        if(!("host" in _domainConfig.opts) || !_domainConfig.opts.host ){

            if (!fs.existsSync(_domainConfig.opts.drop_location)){

                fs.mkdirSync(_domainConfig.opts.drop_location);

            }

            fs.copyFileSync(_file,`${_domainConfig.opts.drop_location}/${path.basename(_file)}`);

            console.log(`----Succcessfully copied file to ${_domainConfig.opts.drop_location} on current domain-----`,``);

        }else{

            const sftp = new Client();

            const _sftpConfig = {
                host: _domainConfig.opts.host,
                port: 22,
                username: _domainConfig.opts.username,
                password: _domainConfig.opts.password
            }
            await sftp.connect(_sftpConfig);
    
            await sftp.put(_file,`${_domainConfig.opts.drop_location}/${path.basename(_file)}`);
        
            console.log(`----Succcessfully uploaded to cutomer domain-----`,`${_domainConfig.opts.drop_location}`);

        }

    } catch (err) {
        console.log(`Error inside uploadFileToCustomerDomainScript.js `, err);
    }

}



exports.scriptToRun = uploadFileToCustomerDomain;