const fs = require('fs')
const inquirer = require('inquirer')
const chalk = require('chalk')

operation()

function operation() {
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'Selecione a opção desejada',
        choices: [
            'Criar Conta',
            'Consultar Saldo',
            'Depositar',
            'Sacar',
            'Sair'
        ]
    },
    ]).then((answer) => {
        const action = answer['action']

        if (action === "Criar Conta") {
            createAccount()
        }

    })
        .catch((err) => console.log(err))
}

function createAccount() {
    console.log(chalk.bgGreen.black("Obrigado por escolher o nosso banco!"))
    console.log(chalk.green("Defina as opções a seguir"))
    buildAccount()
}

function buildAccount() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Digite um nome para sua conta:'
        }
    ]).then((answer) => {
        const accountName = answer['accountName']
        console.info(accountName)

        if(!fs.existsSync('accounts')){
            fs.mkdirSync('accounts')
        }

        if(fs.existsSync(`accounts/${accountName}.json`)){
            console.log(chalk.bgRed.black("Está conta já existe. Escolha outro nome."))
            buildAccount()
        }

        fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}', function(err) {
            console.log(err)
        })

    }).catch((err) => console.log(err))

}