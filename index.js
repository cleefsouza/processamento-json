const fs = require("fs");
const dir = "./uf";

const dataJson = (filename) => {
    const json = fs.readFileSync(`${filename}.json`, "utf-8", (err, data) => {
        if (err || !data) {
            console.error(`Ocorreu um erro ao ler o arquivo!\n${err}`);
            return;
        }
    });

    return JSON.parse(json);
};

const criarPasta = () => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, (err) => {
            if (err) {
                console.error(`Erro ao criar diretório!\n${err}`);
                return;
            }

            console.log("Diretório criado!");
        });
    }
};

const criarArquivosPorUf = (estados, cidades) => {
    estados.forEach((estado) => {
        let filterCidade = cidades.filter((cidade) => {
            return cidade.Estado === estado.ID;
        });

        fs.writeFileSync(
            `./uf/${estado.Sigla}.json`,
            JSON.stringify(filterCidade),
            { enconding: "utf-8", flag: "w" },
            (err) => {
                if (err) {
                    console.error(`Erro ao criar arquivos!\n${err}`);
                    return;
                }
            }
        );
    });
};

const qtdCidadesPorUf = (uf) => {
    const json = fs.readFileSync(`./uf/${uf}.json`, "utf-8", (err, data) => {
        if (err || !data) {
            console.error(`Ocorreu um erro ao ler o arquivo!\n${err}`);
            return;
        }
    });

    return JSON.parse(json).length;
};

const ufComMaisCidades = (estados) => {
    const filterEstados = estados.map((estado) => {
        return { uf: estado.Sigla, qtd: qtdCidadesPorUf(estado.Sigla) };
    });

    filterEstados.sort((a, b) => {
        return a.qtd > b.qtd ? -1 : 1;
    });

    return filterEstados;
};

const sizeNomePorUf = (estados, size = "<") => {
    const filterCidade = estados.map((estado) => {
        const json = fs.readFileSync(
            `./uf/${estado.Sigla}.json`,
            "utf-8",
            (err, data) => {
                if (err || !data) {
                    console.error(`Ocorreu um erro ao ler o arquivo!\n${err}`);
                    return;
                }
            }
        );

        const cidade = JSON.parse(json).sort((a, b) => {
            if (size === ">") {
                return b.Nome.length - a.Nome.length;
            }

            return a.Nome.length - b.Nome.length;
        })[0];

        return { cidade: cidade.Nome, uf: estado.Sigla };
    });

    return filterCidade;
};

const menorNomePorUf = (estados) => {
    const filterCidade = estados.map((estado) => {
        const json = fs.readFileSync(
            `./uf/${estado.Sigla}.json`,
            "utf-8",
            (err, data) => {
                if (err || !data) {
                    console.error(`Ocorreu um erro ao ler o arquivo!\n${err}`);
                    return;
                }
            }
        );

        const cidade = JSON.parse(json).sort((a, b) => {
            return a.Nome.length - b.Nome.length;
        })[0];

        return { cidade: cidade.Nome, uf: estado.Sigla };
    });

    return filterCidade;
};

const estados = dataJson("estados");
const cidades = dataJson("cidades");

criarPasta();
criarArquivosPorUf(estados, cidades);

console.log(qtdCidadesPorUf("AM"));

console.log(ufComMaisCidades(estados));

console.log(ufComMaisCidades(estados).slice(0, 5));

console.log(ufComMaisCidades(estados).slice(-5));

console.log(sizeNomePorUf(estados, ">"));

console.log(sizeNomePorUf(estados));

console.log(
    sizeNomePorUf(estados, ">").sort((a, b) => {
        return b.cidade.length - a.cidade.length;
    })[0]
);

console.log(
    sizeNomePorUf(estados)
        .sort((a, b) => {
            return a.cidade > b.cidade ? -1 : 1;
        })
        .sort((a, b) => {
            return b.cidade.length - a.cidade.length;
        })
        .slice(-1)
);
