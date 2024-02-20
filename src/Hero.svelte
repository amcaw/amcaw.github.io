<script>
    import Scrolly from './Scrolly.svelte';
  
    let stepsData=[
    {"id": 1, "text": "First step text", "desktopImage": "./pics/epicon.jpeg", "mobileImage": "./pics/epicon.jpeg"},
    {"id": 2, "text": "Second step text", "desktopImage": "./pics/oxagon.jpeg", "mobileImage": "./pics/epicon.jpeg"},
    {"id": 3, "text": "Third step text", "desktopImage": "./pics/trojena.jpeg", "mobileImage": "mobileImage3.jpg"}
  ];
  </script>
  
  <Scrolly {stepsData} />
  
  
  
  
