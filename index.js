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
        console.log(action)
    })
        .catch((err) => console.log(err))
}

