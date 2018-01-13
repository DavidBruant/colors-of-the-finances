"use strict";

const {join} = require('path');
const fs = require('fs-extra');
const {DOMParser, XMLSerializer} = require('xmldom');

const {readFile} = fs;

// encoding is incorrect -_-#
const planP = readFile( join(__dirname, 'data/planDeCompte.xml'), {encoding: 'utf-8'} )
.then( str => {
    console.log('plan str', str.length, str.slice(0, 100))
    return (new DOMParser()).parseFromString(str, "text/xml");
})
.then(doc => {
    const comptes = Array.from(doc.getElementsByTagName('Compte'))

    return {
        comptes: comptes.map(e => {
            const ret = {};
            
            ['Code', 'Libelle', 'Lib_court', 'DEquip', 'DR', 'DOES', 'DOIS', 'REquip', 'RR', 'ROES', 'ROIS']
            .forEach(key => {
                ret[key] = e.getAttribute(key);
            })

            return ret
        })
    }
})
.catch(err => console.error('err comptes', err))


const lignesP = readFile( join(__dirname, 'data/CA2015BPAL.xml'), {encoding: 'utf-8'} )
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
        
        ['Nature', 'Fonction', 'ContNat', 'ArtSpe', 'CodRD', 'MtReal', 'OpBudg']
        .forEach(key => {
            const el = e.getElementsByTagName(key)[0];
            if(el)
                ret[key] = el.getAttribute('V')
        })

        return ret
    })
})
.catch(err => console.error('err lignes', err))


Promise.all([planP, lignesP])
.then(([plan, lignes]) => {
    const compteCodes = new Set(plan.comptes.map(c => c['Code']))
    
    const otherCodeLignes = lignes.filter(l => !compteCodes.has(l['Nature']))

    console.log('otherCodeLignes', otherCodeLignes)

})