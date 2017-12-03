# Colors of the finances

Ce dépôt de code contient divers projets explorant et mettant en avant les données contenues dans les fichiers [Totem](http://odm-budgetaire.com).

## Pourquoi ?

### Défiance des citoyens français envers leur administration sur la gestion de l'argent

Le service publique français par le biais de l'administration française est principalement financé par les divers impôts et taxes (TODO ajouter un lien sur les sources de revenus).

En dépit de la [disponibilité obligatoire et légale]("citation needed") des données financières de toutes les administrations et collectivités, les finances publiques [restent un monde assez opaque à la presse généraliste et au grand publique]("à vérifier"). Ainsi, on découvre parfois tard des [erreurs de gestion qui ont duré plusieurs années](Source presse Région Poitou-Charente + rapport CC Régionale) ou ce qui semble parfois être une [manipulation des comptes](source Matthieu Rouveyre sur le CA 2016 de la Mairie de Bordeaux).

Ce genre de problèmes contribue à agrandir la méfiance des citoyens français envers la gestion financière des institutions.

Parmi les sources du problème : 
* les données financières des Comptes Administratifs (réalisé) sont dures à trouver
* Pour comprendre les documents financiers, il faut des compétences/connaissances dans :
    * les collectivités et de leur fonctionnement (compétence des collectivités, notamment)
    * Construction/fonctionnement du budget d'une grosse [entreprise]("TODO définition INSEE") (... animation/vidéo faite avec la Gironde)
        * fonctionnement de la dette
    * la lecture du document en lui-même (notion de fonction, nature, fonctionnement/investissement, etc.)


### Un début de solution

> les données financières des Comptes Administratifs (réalisé) sont dures à trouver

[Les collectivités locales sont sensées fournir leur compte]("citation needed"). [Depuis la Loi République Numérique dite loi Lemaire, elles sont aussi sensées fournir ces données dans un format interopérable]("citation needed"). Par ailleurs, il semblerait que les collectivités locales partagent déjà leurs comptent avec la DGCL/Bercy via un logiciel qui s'appelle [Totem](http://odm-budgetaire.com) et qui impose [un format de fichier XML bien formalisé et documenté]("TODO lien vers XML schéma + doc").

On pourrait donc imaginer un monde où toutes les collectivités locales partagent leurs fichiers Totem sur le site web d'open data de leur choix qui sera répertorié par data.gouv.fr


> Pour comprendre les documents financiers, il faut des compétences/connaissances

Il s'agit d'un problème notamment parce que tous les citoyens français n'ont pas le temps d'acquérir ces compétences/connaissances.
Ce manque de compétence les empêche de juger rapidement si la santé financière d'une collectivité est bonne ou pas.

Une solution ici pourrait être de réunir des personnes qui ont la compétence aujourd'hui et des personnes qui savent coder pour créer des outils qui évaluent automatiquement autant que possible la santé financière des collectivités. Cet effort serait open source, documenté et basé sur des données open data. Il serait donc auditable, criticable et pourrait être réutilisé par d'autres groupes qui contesteraient la validité/pertinence des algorithmes choisis pour évaluer la santé financière.


