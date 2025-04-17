

<div class="article">

<p>Ceci est un changement onMount, c'est comme quand tous les préparatifs de la fête sont terminés, la salle est décorée, la musique est prête, et les lumières sont éteintes. Dès que la personne pour qui la fête est organisée ouvre la porte et entre dans la salle (ce qui est comme le moment où notre composant est "monté" sur la page web), tout le monde crie "Surprise !" et la fête commence. En termes de programmation, onMount est la fonction qui est appelée dès que le composant est prêt à l'emploi, tout comme la fête qui commence quand la personne entre dans la salle.</p>
<p>Dans notre script, onMount configure un observateur qui regarde quels éléments de la page sont visibles à l'écran. C'est un peu comme si nous avions un photographe à la fête qui prend des photos à chaque fois qu'un nouvel invité entre dans la salle. Si un invité (élément) devient visible, le photographe (observateur) note qui est arrivé (change l'étape active).</p>
<p>onDestroy, d'un autre côté, c'est comme la fin de la fête. Quand tout le monde est parti, et il est temps de tout nettoyer et de fermer la salle. En programmation, onDestroy est appelé juste avant que le composant soit retiré de la page. C'est comme si nous disions au photographe de s'arrêter de prendre des photos et de rentrer chez lui. Dans notre script, cela signifie dire à l'observateur d'arrêter de surveiller les éléments, car la "fête" est terminée.</p>

<p>Donc, <strong>onMount</strong> est comme la mise en place et le début de la fête, et <strong>onDestroy</strong> est comme le nettoyage et la fin.</p>

</div>



