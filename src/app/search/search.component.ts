import { Component } from '@angular/core';

@Component({
  selector: 'app-search',
  standalone:false,
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  searchTitle = 'Find Best HealthCare';
  searchQuery = '';
  location = '';

  search() {
    console.log('Searching for:', this.searchQuery, 'at', this.location);
    // Implement search functionality here
  }
}
