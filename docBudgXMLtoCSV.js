import {join} from 'path';

import * as fs from 'fs-extra';
import {DOMParser, XMLSerializer} from 'xmldom';
import {csvParse} from 'd3-dsv';
import {sum} from 'd3-array';


const {readFile} = fs;

// encoding is incorrect -_-#
const planP = readFile( join(__dirname, 'data/planDeCompte.xml'), {encoding: 'utf-8'} )
.then( str => {
    console.log('plan str', str.length, str.slice(0, 100))
    return (new DOMParser()).parseFromString(str, "text/xml");
})
.then(doc => {
    const comptes = Array.from(doc.getElementsByTagName('Compte'))
    const chapitres = Array.from(doc.getElementsByTagName('Chapitre'))

    return {
        comptes: comptes.map(e => {
            const ret = {};
            
            ['Code', 'Libelle', 'Lib_court', 'DEquip', 'DR', 'DOES', 'DOIS', 'REquip', 'RR', 'ROES', 'ROIS'].forEach(key => {
                ret[key] = e.getAttribute(key);
            })

            return ret
        }),
        chapitres: chapitres.map(e => {
            const ret = {};
            
            ['Code', 'Libelle', 'Lib_court', 'TypeChapitre', 'Section', 'Special'].forEach(key => {
                ret[key] = e.getAttribute(key);
            })

            return ret
        })
    }
})
.catch(err => console.error('err comptes', err))


const lignesP = readFile( join(__dirname, 'data/CA2016BPAL.xml'), {encoding: 'utf-8'} )
.then( str => {
    console.log('doc budg str', str.length, str.slice(0, 100))
    return (new DOMParser()).parseFromString(str, "text/xml");
})
.then(doc => {
    //console.log('doc', doc)

    const xmlLignes = Array.from(doc.getElementsByTagName('LigneBudget'))

    console.log('Lignes budgétaires', xmlLignes.length)

    return xmlLignes.map(e => {
        const ret = {};
        
        ['Nature', 'Fonction', 'ContNat', 'ArtSpe', 'CodRD', 'MtReal', 'OpBudg'].forEach(key => {
            const el = e.getElementsByTagName(key)[0];
            if(el)
                ret[key] = el.getAttribute('V')
        })

        return ret
    })
})
.catch(err => console.error('err lignes', err))


const csvP = readFile( join(__dirname, 'data/CA2016.csv'), {encoding: 'utf-8'} )
.then( csvParse )
.catch(err => console.error('err csv', err))

function rowId({RD, fonction, nature}){
    return `${RD}-${fonction}-${nature}`;
}

Promise.all([planP, lignesP, csvP])
.then(([plan, lignes, csv]) => {
    const compteCodes = new Set(plan.comptes.map(c => c['Code']))
    const sectionByChapitreCode = new Map()
    plan.chapitres.forEach(c => sectionByChapitreCode.set(c['Code'], c['Section']))
    
    const otherCodeLignes = lignes.filter(l => !compteCodes.has(l['Nature']))

    console.log(`Nombre de lignes d'ordre réel:`, lignes.filter(l => l["OpBudg"] === "0").length)
    console.log(`Articles spéciaux`, lignes.filter(l => l["ArtSpe"] === "true").length)

    console.log(`Lignes dont la nature n'est pas un Code d'un compte du plan de compte: `, otherCodeLignes)

    console.log(`Comptes dont le DR ou RR n'est pas un numéro de chapitre`, plan.comptes.filter(c => {
        return (c['DR'] && !sectionByChapitreCode.has(c['DR'])) || (c['RR'] && !sectionByChapitreCode.has(c['RR']))
    }))

    const xmlRowById = new Map();

    for(const r of lignes){
        const id = rowId({
            RD: r['CodRD'],
            fonction: r['Fonction'],
            nature: r['Nature']
        });

        if(Number(r['MtReal']) > 0 && r["OpBudg"] === "0"){
            const idRows = xmlRowById.get(id) || [];
            idRows.push(r);
            xmlRowById.set(id, idRows);
        }
    }

    const csvRowById = new Map();

    for(const r of csv){
        const id = rowId({
            RD: r['Dépense/Recette'],
            fonction: r['Rubrique fonctionnelle'].trim().slice(1),
            nature: r['Article'].trim().slice(1)
        });

        const idRows = csvRowById.get(id) || [];
        idRows.push(r);
        csvRowById.set(id, idRows);
    }

    const xmlRowsNotInCSV = new Map(xmlRowById);

    console.log('xmlRowsNotInCSV initial', [].concat(...[...xmlRowsNotInCSV.values()]).length)

    for(const [id, xmlRows] of xmlRowsNotInCSV){
        const correspondingCSVRows = csvRowById.get(id);

        if(correspondingCSVRows){
            const xmlAmount = sum(xmlRows.map(r => Number(r['MtReal'])))
            const csvAmount = sum(correspondingCSVRows.map(r => Number(r['Montant'])))

            if(xmlAmount - csvAmount < 0.1)
                xmlRowsNotInCSV.delete(id);
        }
    }

    console.log('xmlRowsNotInCSV', [].concat(...[...xmlRowsNotInCSV.values()]))

})
.catch(err => console.error('err', err))