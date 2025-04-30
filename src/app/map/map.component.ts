import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import opencage from 'opencage-api-client';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-map',
  standalone:false,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  map!: L.Map;
  location: string = ''; // liée à l'input
  marker!: L.Marker;



  initMap(): void {
    this.map = L.map('map').setView([36.8065, 10.1815], 11); // Centre Tunisie
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }

  searchLocation(): void {
    if (!this.location) return;

    opencage.geocode({ key: 'dd6574253de9436e969c176d94e1132b', q: this.location })
      .then(data => {
        if (data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry;

          this.map.setView([lat, lng], 16);

          if (this.marker) this.map.removeLayer(this.marker);

          this.marker = L.marker([lat, lng]).addTo(this.map)
            .bindPopup(this.location)
            .openPopup();
        } else {
          alert("Localisation non trouvée");
        }
      })
      .catch(error => {
        console.error(error);
        alert("Erreur lors de la géolocalisation");
      });
  }

  constructor(private route: ActivatedRoute) {}

ngOnInit(): void {
  this.initMap();

  this.route.queryParams.subscribe(params => {
    const loc = params['location'];
    if (loc) {
      this.location = loc;
      this.searchLocation(); // auto-recherche
    }

    
  });
}


}
