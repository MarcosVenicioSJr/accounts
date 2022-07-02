const fs = require('fs')
const inquirer = require('inquirer')
const chalk = require('chalk')

operation()

function operation() {
    inquirer.prompt([{
        type: 'list',
        name: 'accounts',
        message: 'Selecione a opção desejada',
        choices: [
            'Criar Conta',
            'Consultar Saldo',
            'Depositar',
            'Sacar',
            'Sair'
        ]
    },
    ]).then()
    .catch(err => console.log(err))
}