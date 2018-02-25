# Documentation du format de données `<DocumentBudgetaire>`

## Origines et usage

Les fichiers `<DocumentBudgetaire>` sont produits par les collectivités territoriales et autres établissements publics dans le cadre du [projet Actes Budgétaires](https://www.collectivites-locales.gouv.fr/actes-budgetaires-0) qui se repose sur la [plateforme @ctes](https://www.collectivites-locales.gouv.fr/actes-0) ([Présentation technique](https://www.collectivites-locales.gouv.fr/files/files/2016_03_11_Presentation_ACTES_Prefets_pr_emetteurs.pdf)).

Un fichier correspond à **un** document budgétaire d'**une étape budgétaire** (Budget Primitif, Compte Administratif, etc.) d'**un établissement public** pour **un exercice** (une année). Le format de fichier est commun à tous les types d'établissements publics et de collectivités territoriales.

Les établissements publics transmettent leurs fichiers `<DocumentBudgetaire>` aux préfectures via le [logiciel TotEM](http://odm-budgetaire.org/). Par abus de langage, on appelle parfois ces fichiers des **"fichiers TotEM"**.


## Documentation existante du fichier

Il s'agit de fichiers [XML](https://fr.wikipedia.org/wiki/Extensible_Markup_Language). Dans beaucoup de documents, on appelle aussi ce fichier un *"flux XML"*

Il existe un [XML Schema](https://fr.wikipedia.org/wiki/XML_Schema) décrivant le format utilisé. Le Schema est maintenu et change régulièrement (environ 2-3 fois par an sur les 4 dernières années). On peut [télécharger chaque version du schema](http://odm-budgetaire.org/composants/schemas/). Il existe une [documentation qui décrit les changements de chaque version](http://odm-budgetaire.org/composants/schemas/schemas.xml). Enfin, une version HTML de [la dernière version du schema est disponible en ligne](http://odm-budgetaire.org/doc-schema/doc-schema.html).


## Réutilisation et contribution

La [page de présentation de l'outil TotEM](http://odm-budgetaire.org/pagesIndex/outil-totem.html) suggère que le logiciel est sous licence LGPL. Toutefois, le code source n'a pas encore été trouvé.

Ce logiciel est édité par la [DGCL](http://www.dotations-dgcl.interieur.gouv.fr/consultation/accueil.php), mais il n'est pas clair si ce logiciel est produit en interne ou s'il est délégué à une entreprise via un marché. Dans tous les cas, il n'existe pas de chemin clairement balisé pour contribuer au logiciel TotEM ou au format de données.


## Détail du contenu

Cette section documente la structure et les contenus du fichier. Il ne s'agit pas d'une description exhaustive mais d'une documentation qui permet de naviguer dans le fichier ainsi qu'une mise en avant des éléments qui pourraient être utiles quand ces fichiers `<DocumentBudgetaire>` seront en open data sur data.gouv.fr ou ailleurs.

Pour naviguer dans des vrais fichiers, on peut trouver les fichiers du Département de la Gironde qui les fournit en open data : 
- Comptes administratifs : https://www.datalocale.fr/dataset/comptes-administratifs-budget-principal-donnees-budgetaires-du-departement-de-la-gironde
- Budgets primitifs : https://www.datalocale.fr/dataset/budget-previsionnel-budget-principal-donnees-budgetaires-du-departement-de-la-gironde

Le fichier du [CA 2016 du Département de la Gironde](https://www.datalocale.fr/dataset/comptes-administratifs-budget-principal-donnees-budgetaires-du-departement-de-la-gironde/resource/2488b983-b08e-44ab-944d-2527953e5c03) est pris en exemple.


### En-tête XML

Il semblerait que les fichiers produits par TotEM sont encodés en `ISO-8859-1`, ce qui n'est pas très *[web-friendly](https://encoding.spec.whatwg.org/#preface)*. 

L'outil d'anonymisation [prend l'initiative de convertir les fichiers en UTF-8](https://github.com/dtc-innovation/anonymisation-document-budgetaire/blob/87b46931f2a645e117cb20257fbbd768652cc5f1/bin/anon-doc-budg.js#L54).


### Element racine 

````xml
<DocumentBudgetaire xsi:schemaLocation="http://www.minefi.gouv.fr/cp/demat/docbudgetaire Actes_budgetaires___Schema_Annexes_Bull_V15\DocumentBudgetaire.xsd" xmlns="http://www.minefi.gouv.fr/cp/demat/docbudgetaire" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
...
</DocumentBudgetaire>
````

On peut noter qu'aucune des URL fournies n'est valide.

### Premier niveau

#### Version du Schema 

```xml
<VersionSchema V="80"/>
```

Définit la version du XML Schema utilisée pour valider ce fichier


#### Scellement

```xml
<Scellement md5="9c63f8cb097f133791033ca83ffde333" sha1="9672e65b06fc1d3fc1516992efd274948abaf362" date="2017-04-25T08:11:48"/>
```

> Le scellement est une action qui permet à un ordonnateur d'indiquer qu'il ne fera plus de modification du flux avant son transfert en préfécture ou à la DGFiP.
>
> Le scellement n'est pas une signature électronique, et n'a pas valeur probante. C'est une empreinte qui permet simplement de savoir si le flux a été altéré pendant son transfert.
>
> Avant le calcul de l'empreinte, si le bloc Scellement existe dans le flux il est supprimé. Le flux est ensuite canonisé par canonisation non exclusive sans commentaires.

[Source](http://odm-budgetaire.org/doc-schema/Class_Scellement_xsd_Complex_Type_TScellement.html#TScellement)

Etant donné qu'il existe des mécanismes de vérification de non-altération au niveau des protocoles réseau ([FCS](https://en.wikipedia.org/wiki/Frame_check_sequence), [checksum](https://en.wikipedia.org/wiki/IPv4_header_checksum), [segmentation TCP](https://fr.wikipedia.org/wiki/Transmission_Control_Protocol#Structure_d'un_segment_TCP)), la valeur ajoutée du scellement non-signature n'est pas claire.

Le choix d'avoir un MD5 **ET** un SHA1 n'est pas documenté.

A priori, le processus d'anonymisation d'un document budgétaire altère le document d'une manière qui rend les valeurs de scellement inutiles. Cette hypothèse n'a pas été vérifiée.


#### En-tête budgétaire

```xml
<EnTeteDocBudgetaire>Struc
    <DteStr V="2017-03-28"/>
    <LibellePoste V="Payeur Départemental"/>
    <IdPost V="033090"/>
    <LibelleColl V="DEPARTEMENT DE LA GIRONDE"/>
    <IdColl V="22330001300016"/>
    <NatCEPL V="Départements"/>
</EnTeteDocBudgetaire>
```

`DteStr` est la date où l'établissement public a émis le document.

`IdColl` est l'identifiant de la collectivité public. Il s'agit du numéro SIRET. Normalement, il devrait être possible de croiser ces fichers avec la [base de données SIREN](https://www.data.gouv.fr/fr/datasets/base-sirene-des-entreprises-et-de-leurs-etablissements-siren-siret/).


### Budget

#### En-tête budget

```xml
<EnTeteBudget>
    <LibelleEtab V="BUDGET PRINCIPAL"/>
    <IdEtab V="22330001300016"/>
    <CodColl V="001"/>
    <CodBud V="00"/>
    <Nomenclature V="M52-M52"/>
</EnTeteBudget>
```

`IdEtab` correspond au SIRET de l'établissement (parfois, une collectivité possède plusieurs établissements).

`Nomenclature` correspond au type de nomenclature utilisée (`M52-M52` pour les départements, `M14_COM_SUP3500` pour les communes de plus de 3500 habitants, etc) et permet donc d'identifier le type de collectivité.


#### Bloc budget

```xml
<BlocBudget>
    <NatDec V="09"/>
    <Exer V="2016"/>
    <DteDec V="2015-12-18"/>
    <DteDecEx V="2015-12-18"/>
    <NatVote V="FcIc"/>
    <OpeEquip V="false"/>
    <VoteFormelChap V="false"/>
    <TypProv V="2"/>
    <BudgPrec V="1"/>
    <ReprRes V="1"/>
    <NatFonc V="3"/>
    <PresentationSimplifiee V="false"/>
    <CodTypBud V="P"/>
    <IdEtabPal V="22330001300016"/>
</BlocBudget>
```

`NatDec` identifie le type de document :

| valeur | sémantique |
|--------|------------|
| 01 | Budget primitif       |
| 02 | Décision modificative |
| 03 | Budget supplémentaire |
| 09 | Compte administratif  |

`Exer` correspond à l'année de l'exercice.


#### Lignes budgétaires

Les lignes constituent le cœur du document budgétaire :

```xml
<LigneBudget>
    <Nature V="21313"/>
    <Fonction V="50"/>
    <ContNat V="21"/>
    <ArtSpe V="false"/>
    <CodRD V="R"/>
    <MtBudgPrec V="0.00"/>
    <MtRARPrec V="0.00"/>
    <MtPropNouv V="0.00"/>
    <MtPrev V="0.00"/>
    <CredOuv V="2375.41"/>
    <MtReal V="2375.41"/>
    <MtRAR3112 V="0.00"/>
    <OpBudg V="0"/>
    <MtSup Code="ProdChaRat" V="0.00"/>
    <MtSup Code="BudgetHorsRAR" V="2375.41"/>
</LigneBudget>
```

`CodRD` indique s'il s'agit d'une recette ou d'une dépense.

`Nature` correspond à la nature de la recette/dépense, c'est-à-dire au "quoi". Le numéro est un numéro d'article. Exemples de nature : carburant, dépenses de personnel…

`Fonction` correspond à la fonction de la recette/dépense, c'est-à-dire au "pourquoi". Le numéro est un numéro de fonction. Exemples de fonctions : éducation, sécurité.

`ContNat` correspond au numéro de compte.

À partir de toutes ces informations on peut savoir, en regardant dans le [plan de compte](http://odm-budgetaire.org/composants/normes/2016/M52/M52/planDeCompte.xml) pour trouver le chapitre :
dans le tableau "Liste des comptes et utilisations", utiliser le `ContNat` comme code et voir le chapitre correspondant dans la colonne RR ou DR pour une recette ou une dépense respectivement.

Pour savoir s'il s'agit de **F**onctionnement ou d'**I**nvestissement, regarder dans le tableau "Liste des chapitres" : 
Utiliser le code de chapitre et regarder la colonne *SECTION*.

`OpBudg` permet de différencier les opération réelles (`0`) ou d'ordre (`1`). On ne se soucie habituellement que des opérations réelles.

`MtReal` correspond au montant vraiment réalisé. Il n'a sûrement de sens que dans un Compte Administratif.


### Annexes

Les annexes contiennent un trésor d'informations. 

Délibérément, cette section ne documente pas exhaustivement toutes les parties de l'annexe, mais seulement des morceaux choisis. La liste exhaustive peut être trouvée dans le [documentation générée à partir du XML Schema](http://odm-budgetaire.org/doc-schema/Class_Budget_xsd_Complex_Type_TBudget.html#TBudget_Annexes)

Toutes les parties des annexes sont délimitées par des balises `<DATA_XXX>` dont le contenu est une liste d'éléments `<XXX>`.


#### Les subventions (`<DATA_CONCOURS>`)

```xml
<CONCOURS>
    <CodNatJurBenefCA V="P1"/>
    <LibOrgaBenef V="24 HEURES SUD GIRONDE "/>
    <MtSubv V="500.0"/>
</CONCOURS>
```

`MtSubv` : montant de la subvention en euros.

`LibOrgaBenef` : chaîne de caractère libre identifiant le bénéficiaire de la subvention. Il est regrettable que le SIRET du bénéficiaire ne soit pas disponible quand celui-ci existe, mais une recherche textuelle devrait pouvoir suffire pour recouper avec la base SIRENE.

`CodNatJurBenefCA` décrit le type de nature juridique du bénéficiaire. Par exemple, `P3` pour les personnes physiques ou `P1` pour les associations loi 1901. Cette information est utilisée par [l'outil d'anonymisation](https://github.com/dtc-innovation/anonymisation-document-budgetaire/) pour anonymiser le `LibOrgaBenef` correspondant.


#### Patrimoine (`<DATA_PATRIMOINE>`)

Il s'agit de tout le patrimoine de la collectivité. On y trouve tout ce qui est possédé des immeubles et voitures jusqu'aux licences logicielles, cafetières ou housses d'ordinateur.

```xml
<PATRIMOINE>
    <CodVariPatrim V="01"/>
    <CodEntreeSorti V="E"/>
    <CodModalAcqui V="01"/>
    <LibBien V=" 2016M00712 - CAFETIERE SENSEO PHILIPS"/>
    <MtValAcquiBien V="1942.82"/>
    <MtCumulAmortBien V="0.00"/>
    <MtAmortExer V="0.00"/>
    <DureeAmortBien V="1"/>
    <NumInventaire V="2016M00712"/>
    <DtAcquiBien V="2016-07-07"/>
    <MtVNCBien3112 V="0.00"/>
    <MtVNCBienSorti V="0.00"/>
    <MtPrixCessBienSorti V="0.00"/>
</PATRIMOINE>
```

`NumInventaire` : identifiant du bien. Il manque notammement auprès de qui l'achat a été fait, peut-être des informations sur le marché public s'il y en a eu un, ainsi que le SIRET de l'entreprise qui a produit/vendu ce bien.

`MtValAcquiBien` : valeur d'acquisition du bien.

`DtAcquiBien` : date d'acquisition du bien.


#### Les emprunts (`<DATA_EMPRUNT>`)

Il s'agit des emprunts contractés par la collectivité, souvent pour financer ses investissements. Chaque `<EMPRUNT>` correspond à un emprunt que la collectivité n'a pas encore remboursé entièrement.

```xml
<EMPRUNT>
    <CodTypEmpr V="09"/>
    <CodProfilAmort V="X"/>
    <CodProfilAmortDtVote V="X"/>
    <AnEncaisse V="2007"/>
    <ObjEmpr V="6776/1104016/REAMENAGEMENT ET COMPACTAGE"/>
    <MtEmprOrig V="807974.1"/>
    <DureeRest V="1.5"/>
    <DureeRestInit V="1.5"/>
    <LibOrgaPreteur V="CAISSE DEPOTS CONSIGNATIONS"/>
    <CodPeriodRemb V="I"/>
    <CodPeriodRembDtVote V="I"/>
    <CodPeriodRembReneg V="X"/>
    <CodTyptxInit V="V"/>
    <CodTyptxDtVote V="V"/>
    <IndexTxVariInit V="LIVRET A"/>
    <TxActuaInit V="3.438"/>
    <IndexTxVariDtVote V="LIVRET A"/>
    <TxActua V="1.95"/>
    <IndiceEmpr V="EUR"/>
    <MtIntExer V="3963.31"/>
    <MtCapitalExer V="86666.63"/>
    <MtCapitalRestDu_01_01 V="237326.39"/>
    <MtICNE V="721.05"/>
    <MtCapitalRestDu_31_12 V="150659.76"/>
    <NomBenefEmprGaranti V="SA HLM CLAIRSIENNE"/>
    <CodTypEmprGaranti V="03"/>
    <NumContrat V="6776/1104016"/>
    <IndSousJacent V="1"/>
    <IndSousJacentDtVote V="1"/>
    <Structure V="A"/>
    <StructureDtVote V="A"/>
    <DtSignInit V="2007-12-10"/>
    <DtEmission V="01/01/2007"/>
    <Dt1RembInit V="2008-01-01"/>
    <Txinit V="4.2"/>
    <RtAnticipe V="false"/>
    <TypeSortie V="A"/>
    <MtSortie V="0.0"/>
    <Couverture V="false"/>
    <MtCouvert V="0.0"/>
    <Renegocie V="false"/>
    <DureeContratInit V="10.0"/>
    <TxMini V="LIVRET A + 1,20"/>
    <TxMaxi V="LIVRET A + 1,20"/>
    <MtInt778 V="0.0"/>
</EMPRUNT>
```

**Relation de la collectivité à l'emprunt**

`CodTypEmpr` identifie notamment si l'emprunt est fait par la collectivité pour elle-même (`01`) ou si elle garantit seulement l'emprunt pour un autre établissement (`09`).

**Emprunt en lui-même**

`DtSignInit` : date de signature de l'emprunt.

`DureeContratInit` : durée initiale de remboursement de l'emprunt (en années).

`MtEmprOrig` : montant originel de l'emprunt.

`MtCapitalRestDu_31_12` : montant restant à rembourser.

`Txinit` : taux initial de l'emprunt.

`Structure` : information documentant s'il s'agit d'un emprunt à taux fixe (`A`) ou un emprunt plus complexe, dont le taux serait indicé sur le CAC40, une autre monnaie ou autre chose. Il y a habituellement un facteur multiplicateur maximum au taux d'emprunt de base. Si ce facteur dépasse 5, il s'agit d'un emprunt potentiellement dangereux que l'on appelle usuellement « emprunt toxique ». Il est identifié ici par la valeur `F`.

**Relation au prêteur**

`LibOrgaPreteur` : organisme prêteur. Il peut s'agir d'établissements publics (Caisse des dépôts et consignations) ou privés (LCL, Crédit agricole…).

`ObjEmpr` : identifiant du contrat de prêt.



#### PPP (`<DATA_PPP>`)

Données liées aux partenariats public-privé. Cette section n'a pas été étudiée, mais elle existe.


#### Pret (`<DATA_PPP>`)

Argent que l'établissement public prête à d'autres.

```xml
<PRET>
    <CodTypPret V="N"/>
    <NomBenefPret V="Nom anonymisé"/>
    <DtDelib V="1990-01-15"/>
    <MtCapitalRestDu_31_12 V="1290.48"/>
    <MtCapitalExer V="0.0"/>
    <MtIntExer V="0.0"/>
</PRET>
```

Les prêts ne renseignent pas la nature juridique du bénéficiaire (par un élément `CodNatJurBenefCA` comme on peut trouver dans les subventions). Vu que certains prêts sont faits à des personnes physiques, il a été nécessaire d'anonymiser tous les prêts.


#### Personnel (`<DATA_PERSONNEL>`)

Liste de tous les personnels de la collectivité publique.

````xml
<PERSONNEL>
    <CodTypAgent V="I"/>
    <EmploiGradeAgent V="Adjoint territorial du patrimoine principal de 1ère classe"/>
    <CodCatAgent V="C"/>
    <TempsComplet V="true"/>
    <Permanent V="true"/>
    <CodSectAgentTitulaire V="CULT"/>
    <IndiceAgent V="'400"/>
    <EffectifBud V="1.0"/>
    <EffectifPourvu V="1.0"/>
</PERSONNEL>
````

Il est possible que la combinaison des informations `EmploiGradeAgent`, `TempsComplet`, `CodCatAgent`, `CodSectAgentTitulaire`, `Permanent` puisse permettre l'identification de la personne physique concernée si l'on croise ces informations avec des connaissances personnelles ou des informations disponibles sur Internet (réseaux sociaux professionnels type Linkedin), surtout dans des petites collectivités qui comptent peu d'agents.

`IndiceAgent` renseigne l'indice de l'agent de la collectivité. Il semblerait que cette information permette de retrouver le salaire de l'agent en question.

Il n'est pas clair à ce jour si ces informations constituent une atteinte à la vie privée.


#### Signature et signataires

```xml
<DATA_SIGNATURE>
    <SIGNATURE>
        <NbrMembExer V="66"/>
        <NbrMembPresent V="47"/>
        <NbrSuffExprime V="46"/>
        <NbrVotePour V="31"/>
        <NbrVoteContre V="15"/>
        <NbrVoteAbstention V="0"/>
        <DtConvoc V="2017-03-29"/>
        <LibPresentPar V="Monsieur le Président"/>
        <LibPresentLieu V="Hôtel du Département Esplanade Charles de Gaulle 33 BORDEAUX"/>
        <DtPresent V="2017-04-13"/>
        <LibDelibPar V="l'Assemblée délibérante"/>
        <LibReuniSession V="Plénière du 13 avril 2017"/>
        <LibDelibLieu V="Hôtel du Département Esplanade Charles de Gaulle 33 BORDEAUX"/>
        <DtDelib V="2017-04-13"/>
        <DtTransmPrefect V="2017-04-24"/>
        <DtPub V="2017-04-24"/>
        <LibFin V="Hôtel du Département Esplanade Charles de Gaulle 33 BORDEAUX"/>
        <DtfFin V="2017-04-24"/>
    </SIGNATURE>
</DATA_SIGNATURE>
<DATA_SIGNATAIRE>
    <SIGNATAIRE>
        <Signataire V="GLEYZE Jean-Luc"/>
    </SIGNATAIRE>
    <!-- autres signataires omis -->
<DATA_SIGNATAIRE>
```

Informations sur le vote et la signature du document en question ainsi que la liste des signataires (élu·e·s). 

