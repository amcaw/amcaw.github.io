

<div class="article">

<p>Ceci est un changement onMount, c'est comme quand tous les pr�paratifs de la f�te sont termin�s, la salle est d�cor�e, la musique est pr�te, et les lumi�res sont �teintes. D�s que la personne pour qui la f�te est organis�e ouvre la porte et entre dans la salle (ce qui est comme le moment o� notre composant est "mont�" sur la page web), tout le monde crie "Surprise !" et la f�te commence. En termes de programmation, onMount est la fonction qui est appel�e d�s que le composant est pr�t � l'emploi, tout comme la f�te qui commence quand la personne entre dans la salle.</p>
<p>Dans notre script, onMount configure un observateur qui regarde quels �l�ments de la page sont visibles � l'�cran. C'est un peu comme si nous avions un photographe � la f�te qui prend des photos � chaque fois qu'un nouvel invit� entre dans la salle. Si un invit� (�l�ment) devient visible, le photographe (observateur) note qui est arriv� (change l'�tape active).</p>
<p>onDestroy, d'un autre c�t�, c'est comme la fin de la f�te. Quand tout le monde est parti, et il est temps de tout nettoyer et de fermer la salle. En programmation, onDestroy est appel� juste avant que le composant soit retir� de la page. C'est comme si nous disions au photographe de s'arr�ter de prendre des photos et de rentrer chez lui. Dans notre script, cela signifie dire � l'observateur d'arr�ter de surveiller les �l�ments, car la "f�te" est termin�e.</p>

<p>Donc, <strong>onMount</strong> est comme la mise en place et le d�but de la f�te, et <strong>onDestroy</strong> est comme le nettoyage et la fin.</p>

</div>



