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
        } else if (action === "Consultar Saldo") {
            getAccountBalance()
        } else if (action === "Depositar") {
            deposit()
        } else if (action === "Sacar") {
            withdraw()
        } else if (action === "Sair") {
            console.log(chalk.bgBlueBright.black("Obrigado por usar o nosso banco!"))
            process.exit()
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

        if (!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts')
        }

        if (fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(chalk.bgRed.black("Está conta já existe. Escolha outro nome."))
            buildAccount()
            return
        }

        fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}', function (err) {
            console.log(err)
        })

        console.log(chalk.green("Tudo certo! Sua conta foi criada com sucesso."))
        operation()

    })
        .catch((err) => console.log(err))

}

function deposit() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual conta você deseja depositar?'
        }
    ]).then((answer) => {
        const accountName = answer['accountName']
        if (!checkAccount(accountName)) {
            return deposit()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto você deseja depositar? '
            },
        ]).then((answer) => {
            const amount = answer['amount']
            addAmount(accountName, amount)
            operation()
        })
            .catch(err => console.log(err))



    })
        .catch(err => console.log(err))
}

function checkAccount(accountName) {
    if (!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black("Esta conta não existe. Escolha outra conta."))
        return false

    }

    return true
}

function addAmount(accountName, amount) {

    const accountData = getAccount(accountName)
    if (!amount) {
        console.log(chalk.bgRed.black("Ocorreu um erro. Tente novamente mais tarde."))
        return deposit()
    }
    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

    fs.writeFileSync(`accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        },
    )

    console.log(chalk.bgGreen.black(`Foi adicionado o valor de R$ ${amount} na sua conta.`))

}

function getAccount(accountName) {
    const accountJson = fs.readFileSync(`accounts/${accountName}.json`, {
        encoding: 'utf-8',
        flag: 'r'
    })

    return JSON.parse(accountJson)
}

function getAccountBalance() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Digite o nome da sua conta'
        },
    ]).then((answer) => {
        const accountName = answer['accountName']

        if (!checkAccount(accountName)) {
            return getAccountBalance()
        }

        const accountData = getAccount(accountName)
        console.log(chalk.bgGreen.black(`O saldo da sua conta é R$${accountData.balance}`))

        operation()

    }).catch(err => console.log(err))
}

function withdraw() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta? '
        },
    ]).then((answer) => {
        const accountName = answer['accountName']

        if (!checkAccount(accountName)) {
            return withdraw()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Qual valor que você deseja sacar? '
            },
        ]).then((answer) => {
            const amount = answer['amount']

            removeAmount(accountName, amount)

        }).catch(err => console.log(err))

    })
        .catch(err => console.log(err))
}

function removeAmount(accountName, amount) {

    const accountData = getAccount(accountName)

    if (!amount) {
        console.log(chalk.bgRed.black("Ocorreu um erro, tente novamente mais tarde."))
        return withdraw()
    }

    if (accountData.balance < amount) {
        console.log(chalk.bgRed.black("Valor indiponível."))
        return withdraw()
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        }
    )

    console.log(chalk.bgGreen.black(`Foi realizado um saque de R$${amount} da sua conta.`))
    operation()
}