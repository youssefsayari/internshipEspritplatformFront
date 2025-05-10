import { Component, AfterViewInit, HostListener, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import HeatmapLayer from 'ol/layer/Heatmap';
import View from 'ol/View';
import OlMap from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Icon, Fill, Text, Stroke, Circle } from 'ol/style';
import { HttpClient } from '@angular/common/http';
import Cluster from 'ol/source/Cluster';
import { CompanyAnalyticsDto } from '../../Model/Company';
import { CompanyService } from '../../Services/CompanyService';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import {UserService} from '../../Services/user.service';
import { ModelClassificationService } from '../../Services/model-classification.service';




interface CompanyLocation {
  lat?: number;
  lng?: number;
}

@Component({
  selector: 'app-globe',
  templateUrl: './globe.component.html',
  styleUrls: ['./globe.component.css']
})
export class GlobeComponent implements AfterViewInit, OnInit {
  companies: CompanyAnalyticsDto[] = [];

  companyClassifications: Map<number, string> = new Map();


  loading = true;
  error: string | null = null;
  selectedCompany: CompanyAnalyticsDto | null = null;
  searchQuery: string = '';
  filteredCompanies: CompanyAnalyticsDto[] = [];
  private map!: OlMap; // Change variable type to OlMap
  private vectorLayer!: VectorLayer;
  private espritLocation = fromLonLat([10.189273959297141, 36.899117075175106]);
  private companyCoordinates = new Map<number, CompanyLocation>();
  userType: string | null = null;
  userConnecte: number | null = null;



  constructor(private http: HttpClient,private companyService: CompanyService, private router: Router,private userService:UserService,    private modelService: ModelClassificationService
) {}


  ngOnInit(): void {
    this.fetchUserDetails().then(() => {
      if(this.userType!=='Admin') {
      this.router.navigate(['/login']);
      }
      this.loadCompanies();
      interval(300000).subscribe(() => this.loadCompanies());
    }).catch((error) => {
      console.error('Error fetching user details:', error);
    });
  }

private classifyAllCompanies() {
  // Initialiser toutes les entreprises avec "Analyse..."
  this.companies.forEach(company => {
    this.companyClassifications.set(company.id, 'Analyse...');
  });

  // Classifier chaque entreprise une par une
  this.companies.forEach(company => {
    this.modelService.classifyCompany({
      sector: company.sector,
      foundingYear: company.foundingYear,
      numEmployees: company.numEmployees || 10
    }).subscribe({
      next: (classification) => {
        this.companyClassifications.set(company.id, classification);
      },
      error: () => {
        this.companyClassifications.set(company.id, '❌ Erreur');
      }
    });
  });
}
   fetchUserDetails(): Promise<void> {
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem('Token');
        if (!token) {
          this.router.navigate(['/login']); // Redirige vers /login si le token est absent
          return reject('Token non trouvé');
        }

        this.userService.decodeTokenRole(token).subscribe({
          next: (userDetails) => {
            localStorage.setItem('userRole', userDetails.role);
            localStorage.setItem('userClasse', userDetails.classe);

            this.userType = userDetails.role;
            this.userConnecte = userDetails.id;

            resolve();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: '⚠️ Error',
              text: 'Failed to fetch user details. Please log in again.',
              width: '50%',
              customClass: {
                popup: 'swal-custom-popup',
                confirmButton: 'swal-custom-button',
              },
            });

            this.router.navigate(['/login']); // Redirige vers /login en cas d'erreur
            reject(err);
          },
        });
      });
    }

    private loadCompanies() {
        this.loading = true;
      this.companyService.getCompaniesAnalytics().subscribe({
        next: (data) => {
          this.companies = data; // Conserver toutes les entreprises
          this.filteredCompanies = [...this.companies];
          this.loading = false;
          this.loadInitialCompanies();
          // Initialiser avant la classification
      this.companies.forEach(c => this.companyClassifications.set(c.id, 'Analyse...'));
      
      // Démarrer la classification après un léger délai
      setTimeout(() => this.classifyAllCompanies(), 500);

        },
        error: (err) => {
          this.error = 'Failed to load companies data';
          this.loading = false;
        }
      });
    }

  // Add this method in the class
  openPartnershipDialog() {
    if (!this.selectedCompany) return;

    const score = this.calculateCompatibility(this.selectedCompany);

    Swal.fire({
      title: `Collaborate with ${this.selectedCompany?.name} ✨`,
      html: `
        <div class="partnership-dialog">
          <div class="compatibility-badge pulse">
            <div class="score">${score}%</div>
            <small>Strategic Alignment</small>
          </div>

          <div class="smart-form">
            <div class="form-group">
              <label>Contact Email</label>
              <input id="email" type="email" value="${this.selectedCompany?.email}" class="swal2-input" readonly>
            </div>

            <div class="form-group">
              <label>Proposed Collaboration</label>
              <textarea id="message" class="swal2-textarea" rows="6">
  Dear ${this.selectedCompany?.name} Team,

  Our compatibility analysis reveals exciting opportunities for collaboration (${score}% alignment)! 🚀

  As Tunisia's leading tech university, we propose:

  🌟 Exclusive access to our Talent Hub:
  - Real-time internship opportunity management
  - Smart candidate matching based on 15+ skill dimensions
  - Automated application processing & student analytics

  🎯 Benefits for ${this.selectedCompany?.name}:
  - Early access to top ESPRIT graduates
  - Brand visibility across 5000+ tech students
  - Curated candidate shortlists within 48h
  - Partnership badge on student profiles

  Let's discuss how we can:
  ✅ Streamline your recruitment pipeline
  ✅ Enhance your employer brand
  ✅ Co-create internship programs

  Available for a 30-min discovery call this week?
              </textarea>
            </div>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Send Proposal',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'partnership-popup',
        htmlContainer: 'partnership-html'
      },
      didOpen: () => {
        document.querySelector('.swal2-textarea')?.addEventListener('input', this.autoImproveMessage);
      },
      preConfirm: () => {
        return {
          email: (document.getElementById('email') as HTMLInputElement).value,
          message: (document.getElementById('message') as HTMLTextAreaElement).value
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.sendPartnershipRequest(result.value);
      }
    });
  }

public calculateCompatibility(company: CompanyAnalyticsDto | null): number {
  if (!company) return 0;

  const weights = {
    sector: this.getSectorWeight(company.sector),
    successRate: Math.min(company.internshipCount * 2, 40),
    reputation: (company.averageRating / 5) * 30
  };
  return Math.min(weights.sector + weights.successRate + weights.reputation, 100);
}

private getSectorWeight(sector: string): number {
  const sectorWeights = {
    'TECHNOLOGY': 40,
    'HEALTHCARE': 30,
    'FINANCE': 25,
    'EDUCATION': 20,
    'OTHER': 10
  };
  return sectorWeights[sector] || 10;
}

private autoImproveMessage(event: Event) {
  // AI logic for auto-improving the message
  const textarea = event.target as HTMLTextAreaElement;
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';

  // Example of automatic enhancement
  const improvedText = textarea.value
    .replace(/hello/gi, 'Hello')
    .replace(/(\d+%)/g, '<strong>$1</strong>');

  textarea.innerHTML = improvedText;
}

private sendPartnershipRequest(data: any) {
  // Use the email service here
  this.companyService.sendPartnershipEmail(data.email, data.message).subscribe({
    next: () => {
      Swal.fire('Success!', 'Partnership request sent', 'success');
    },
    error: () => {
      Swal.fire('Error', 'Failed to send, We are analyzing the issue...', 'error');
    }
  });
}

  private getEspritStyle(): Style {
    return new Style({
      image: new Icon({
        src: 'assets/esprit-marker.png',
        scale: 0.8,
        anchor: [0.5, 1],
        crossOrigin: 'anonymous',
      }),
      text: new Text({
        text: 'ESPRIT\nMain Campus',
        offsetY: -40,
        textAlign: 'center',
        fill: new Fill({ color: '#2c3e50' }),
        stroke: new Stroke({ color: 'rgba(255,255,255,0.9)', width: 3 }),
        font: 'bold 12px Poppins'
      })
    });
  }
  ngAfterViewInit() {
    this.initMap();
    this.initializeMarkers();
    this.initClusterLayer();
    this.initClickInteraction(); // <-- Nouvelle méthode
  }

  private initClickInteraction() {
    this.map.on('click', (evt) => {
      const feature = this.map.forEachFeatureAtPixel(evt.pixel, f => f);

      if (feature) {
        if (feature.get('isEspritLocation')) return;
        const companyData = feature.getProperties() as CompanyAnalyticsDto;
        this.selectCompany(companyData);
        this.showCompanyDetails(companyData);
      }
    });
  }

  private animateMarkers() {
    this.vectorLayer.getSource().getFeatures().forEach((feature, index) => {
      const style = feature.getStyle() as Style;
      const image = style.getImage();

      if (image instanceof Icon) {
        const iconElement = image.getImage(1);
        setTimeout(() => {
          if (iconElement instanceof HTMLImageElement) {
            iconElement.animate(
              [
                { transform: 'scale(1)' },
                { transform: 'scale(1.2)' },
                { transform: 'scale(1)' }
              ],
              {
                duration: 1000,
                easing: 'ease-out',
                iterations: Infinity
              }
            );
          }
        }, index * 100);
      }
    });
  }

  private initTooltips() {
    const tooltip = document.createElement('div');
    tooltip.className = 'ol-tooltip';
    document.body.appendChild(tooltip);

    this.map.on('pointermove', (e) => {
      const feature = this.map.forEachFeatureAtPixel(e.pixel, f => f);
      if (feature) {
        const company = feature.getProperties() as CompanyAnalyticsDto;
        tooltip.innerHTML = `
          <div class="tooltip-header">${company.name}</div>
          <div class="tooltip-sector">${company.sector}</div>
          <div class="tooltip-stats">
            <span>📈 ${company.internshipCount} stages</span>
            <span>⭐ ${company.averageRating}/5</span>
          </div>
        `;
        tooltip.style.display = 'block';
        tooltip.style.left = e.pixel[0] + 'px';
        tooltip.style.top = (e.pixel[1] - 10) + 'px';
      } else {
        tooltip.style.display = 'none';
      }
    });
  }

  private initMap() {
    this.vectorLayer = new VectorLayer({
      source: new VectorSource(),
      visible: true // <-- S'assurer que la couche est visible
    });

    this.map = new OlMap({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
          visible: true
        }),
        this.vectorLayer
      ],
      view: new View({
        center: this.espritLocation,
        zoom: 17,
        projection: 'EPSG:3857' // <-- Spécifier explicitement
      })
    });
  }

  showCompanyDetails(company: CompanyAnalyticsDto) {
    this.selectedCompany = company;
    this.addHighlightEffect(company);
    this.showAnalytics();
  }
  private addHighlightEffect(company: CompanyAnalyticsDto) {
    const source = this.vectorLayer.getSource();
    source.getFeatures().forEach(feature => {
      const featureCompany = feature.getProperties() as CompanyAnalyticsDto; // Extract company data
      const style = featureCompany.id === company.id
      ? this.getHighlightedStyle(featureCompany)
      : this.getMarkerStyle(featureCompany); // <-- Style normal avec icône
      feature.setStyle(style);
    });
  }


  private getHighlightedStyle(company: CompanyAnalyticsDto): Style {
    return new Style({
      image: new Icon({
        src: 'assets/marker.png',
        scale: 0.7,
        color: this.getSectorColor(company.sector),
        anchor: [0.5, 1]
      }),
      text: new Text({
        text: company.name,
        offsetY: -25,
        fill: new Fill({ color: '#FF6B6B' }),
        font: 'bold 14px Poppins',
        stroke: new Stroke({
          color: 'rgba(255,255,255,0.9)',
          width: 3
        })
      })
    });
  }
  showAnalytics() {
    const sectorDistribution = this.calculateSectorDistribution();
    const successRates = this.calculateSuccessRates();

    console.log('Sector Distribution:', sectorDistribution);
    console.log('Success Rates:', successRates);

    this.initHeatmapLayer();
  }
  initHeatmapLayer() {
    this.removeHeatmapLayer();

    const heatmap = new HeatmapLayer({
      source: this.vectorLayer.getSource(),
      blur: 35,
      radius: 25,
      weight: (feature) => {
        if (feature.get('isEsprit')) return 0;

        const company = feature.getProperties() as CompanyAnalyticsDto;
        return this.calculateCompanyImpactScore(company);
      },
      gradient: ['#00ff0020', '#ff0000ff']
    });

    this.map.addLayer(heatmap);
  }

  private calculateCompanyImpactScore(company: CompanyAnalyticsDto): number {
    // Combine nombre de stages réussis et réputation
    const baseScore = company.internshipCount * (company.averageRating || 1);

    // Ajoute un bonus sectoriel
    const sectorBonus = this.getSectorWeight(company.sector) / 10;

    // Applique une courbe logarithmique pour lisser les valeurs
    return Math.log(baseScore + 1) * sectorBonus;
  }

  private generateDensityPoints() {
    const source = this.vectorLayer.getSource();

    // Pour chaque entreprise, ajoutez des points aléatoires autour
    this.companies.forEach(company => {
      const coords = this.companyCoordinates.get(company.id);
      if (coords) {
        // Ajoutez 5-10 points aléatoires autour de chaque entreprise
        const pointCount = 5 + Math.floor(Math.random() * 5);

        for (let i = 0; i < pointCount; i++) {
          // Décalage aléatoire (environ 500m autour)
          const offsetLng = (Math.random() - 0.5) * 0.01;
          const offsetLat = (Math.random() - 0.5) * 0.01;

          const point = new Feature({
            geometry: new Point(fromLonLat([
              coords.lng + offsetLng,
              coords.lat + offsetLat
            ])),
            isDensityPoint: true,
            weight: company.internshipCount * (0.7 + Math.random() * 0.6) // Poids aléatoire basé sur le nombre de stages
          });

          source.addFeature(point);
        }
      }
    });
  }

  private calculateInternshipScore(company: CompanyAnalyticsDto): number {
    return (company.internshipCount || 0) * (company.averageRating || 0);
  }

  // Ajoutez cette méthode pour nettoyer la heatmap
  removeHeatmapLayer() {
    this.map.getLayers().getArray()
      .filter(layer => layer instanceof HeatmapLayer)
      .forEach(layer => this.map.removeLayer(layer));
  }

  private calculateSectorDistribution() {
    return this.companies.reduce((acc, company) => {
      acc[company.sector] = (acc[company.sector] || 0) + 1;
      return acc;
    }, {});
  }
  private calculateSuccessRates() {
    return this.companies.map(company => ({
      name: company.name,
      successRate: (company.internshipCount * company.averageRating) / 100
    }));
  }
  selectCompany(company: CompanyAnalyticsDto) {
    const coords = this.companyCoordinates.get(company.id);

    if (coords && !isNaN(coords.lat) && !isNaN(coords.lng)) {
      this.selectedCompany = { ...company }; // Crée un nouvel objet pour forcer la détection
      this.map.getView().animate({
        center: fromLonLat([coords.lng, coords.lat]),
        zoom: 15,
        duration: 1000
      });
    } else {
      console.error('Coordonnées invalides pour', company.name);
      this.selectedCompany = null;
    }
  }

  getSectors(): string[] {
    return Array.from(new Set(this.companies.map(c => c.sector)));
  }
  getSectorCount(sector: string): number {
    return this.companies.filter(c => c.sector === sector).length;
  }
  private async loadInitialCompanies() {
    console.log('Début du chargement des entreprises', this.companies);

    if (!this.companies.length) {
      console.error('Aucune entreprise à charger !');
      this.loading = false;
      return;
    }

    try {
      // 1. Géocodage parallèle des adresses
      const geocodingPromises = this.companies.map(async company => {
        const coords = await this.geocodeAddress(company.address);
        this.companyCoordinates.set(company.id, coords);
      });

      await Promise.all(geocodingPromises);

      // 2. Initialisation des marqueurs après géocodage
      this.initializeMarkers();

      // 3. Forcer le rafraîchissement après le rendu initial
      this.forceDataRefresh();

      // 4. Filtrage initial
      this.filterCompanies();

    } catch (error) {
      console.error('Erreur de chargement:', error);
      this.error = 'Erreur de chargement des coordonnées';
      this.loading = false;
    }
  }

  private forceDataRefresh() {
    // 1. Rafraîchir la source vectorielle
    const source = this.vectorLayer.getSource();
    source.changed();

    // 2. Mettre à jour la taille de la carte
    this.map.updateSize();

    // 3. Réinitialiser le feature overlay
    if (this.selectedCompany) {
      const temp = this.selectedCompany;
      this.selectedCompany = null;
      setTimeout(() => {
        this.selectedCompany = temp;
      }, 50);
    }

    // 4. Forcer un nouveau rendu de la carte
    this.map.renderSync();
  }
  private async geocodeAddress(address: string): Promise<CompanyLocation> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=tn,fr`;
    try {
      const response: any = await this.http.get(url).toPromise();
      console.log('Geocoding response:', response);

      if (!response?.length) {
        console.error('No results for address:', address);
        throw new Error('Aucun résultat');
      }
      const bestMatch = response.find((r: any) => r.type.match(/street|building/)) || response[0];
      console.log('Best match:', bestMatch); // <-- Log

      return {
        lat: parseFloat(bestMatch.lat),
        lng: parseFloat(bestMatch.lon)
      };

    } catch (error) {
      console.error('Geocoding failed:', error);
      return { lat: 36.899117, lng: 10.189273 }; // Coordonnées ESPRIT par défaut
    }
  }

  private refreshMap() {
    this.vectorLayer.getSource().changed(); // Force le redessin
    this.map.updateSize();
  }
  private addMarker(company: CompanyAnalyticsDto, coords: CompanyLocation) {
  console.log('Création du marqueur pour', company.name);
  console.log('Coordonnées brutes:', coords);

  const projectedCoords = fromLonLat([coords.lng, coords.lat]);
  console.log('Coordonnées projetées:', projectedCoords);
      const feature = new Feature({
      geometry: new Point(fromLonLat([coords.lng, coords.lat]))
    });
    feature.setProperties(company);

    // Utiliser le nom au lieu de l'ID pour plus de fiabilité
    if (company.name.toLowerCase() === 'esprit') { // <-- Correction ici
      console.log('Setting ESPRIT style');
      feature.setStyle(this.getEspritStyle());
    } else {
      console.log('Setting company style with color:', this.getSectorColor(company.sector));
      feature.setStyle(this.getMarkerStyle(company)); // <-- Utiliser getMarkerStyle
    }

    const source = this.vectorLayer.getSource();
    if (source) {
      source.addFeature(feature);
      console.log('Feature added:', feature);
    }
  }

  private getMarkerStyle(company: CompanyAnalyticsDto): Style {
    return new Style({
      image: new Icon({
        src: 'assets/marker.png', // <-- Remplacer logoUrl par le chemin fixe
        scale: 0.8,
        anchor: [0.5, 1],
        color: this.getSectorColor(company.sector),
        crossOrigin: 'anonymous'
      }),
      text: new Text({
        text: company.name,
        offsetY: -25,
        fill: new Fill({ color: '#2c3e50' }),
        font: 'bold 12px Poppins',
        stroke: new Stroke({
          color: 'rgba(255,255,255,0.9)',
          width: 3
        })
      })
    });
  }


  returnToEsprit() {
    this.map.getView().animate({
      center: this.espritLocation,
      zoom: 17,
      duration: 1000
    });
    this.selectedCompany = null;
  }

  filterCompanies() {
    this.filteredCompanies = this.companies
      .filter(c =>
        c.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        c.sector.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
      .sort((a, b) => this.calculateCompatibility(b) - this.calculateCompatibility(a));
  }



  openWebsite(url: string) {
    window.open(url, '_blank');
  }

  showInternships(companyId: number) {
    console.log('Afficher les stages pour companyId:', companyId);
  }

  @HostListener('window:resize')
  onResize() {
    this.map?.updateSize();
  }
  private initializeMarkers() {
    this.vectorLayer.getSource().clear();
    this.addEspritMarker(); // Ajouter le marqueur fixe

    // Ajout des entreprises avec vérification de coordonnées
    this.companies.forEach(company => {
      const coords = this.companyCoordinates.get(company.id);
      if (coords && !isNaN(coords.lat) && !isNaN(coords.lng)) {
        this.addCompanyMarker(company, coords);
      }
    });
  }
  private addCompanyMarker(company: CompanyAnalyticsDto, coords: CompanyLocation) {
    const feature = new Feature({
      geometry: new Point(fromLonLat([coords.lng, coords.lat])),
      ...company // Attache toutes les données
    });

    feature.setProperties({
      ...company,
      isCompany: true // Marqueur personnalisé
    });

    feature.setStyle(this.getMarkerStyle(company));
    this.vectorLayer.getSource().addFeature(feature);
  }
  private getCompanyStyle(company: CompanyAnalyticsDto): Style {
    return new Style({
      image: new Circle({
        radius: 10,
        fill: new Fill({ color: this.getSectorColor(company.sector) }),
        stroke: new Stroke({ color: 'white', width: 2 })
      }),
      text: new Text({
        text: company.name,
        offsetY: -15,
        fill: new Fill({ color: '#2c3e50' }),
        font: 'bold 12px Arial'
      })
    });
  }
  // Ajoutez ces méthodes
  private initClusterLayer() {
    const clusterSource = new Cluster({
      distance: 40,
      source: this.vectorLayer.getSource()
    });

    const clusterLayer = new VectorLayer({
      source: clusterSource,
      style: (feature) => {
        const size = feature.get('features').length;
        const companies = feature.get('features') as Feature[];
        const sectorsArray = Array.from(new Set<string>(
          companies.map(f => f.getProperties().sector)
        ));
        const sectorColor = sectorsArray.length > 1 ?
          '#FF6B6B' :
          this.getSectorColor(sectorsArray[0]);
        return new Style({
          image: new Circle({
            radius: 15 + Math.log(size) * 3,
            fill: new Fill({
              color: sectorColor
            }),
            stroke: new Stroke({
              color: 'white',
              width: 2
            })
          }),
          text: new Text({
            text: size.toString(),
            fill: new Fill({ color: 'white' }),
            font: 'bold 14px Poppins'
          })
        });
      }
    });
    this.map.addLayer(clusterLayer);
  }

// Modifier addPulseEffect()
private addPulseEffect() {
  this.vectorLayer.getSource().getFeatures().forEach(feature => {
    const style = feature.getStyle() as Style;
    const icon = style.getImage() as Icon;
    const baseColor = icon.getColor() || '#4CAF50';

    let opacity = 0.8;
    icon.setOpacity(opacity);

    setInterval(() => {
      opacity = 0.6 + Math.abs(Math.sin(Date.now() / 500)) * 0.4;
      icon.setOpacity(opacity);
    }, 50);
  });
}
private addZoomEffect() {
  this.map.getView().on('change:resolution', () => {
    const zoom = this.map.getView().getZoom();
    this.vectorLayer.setStyle((feature) => {
      const company = feature.getProperties() as CompanyAnalyticsDto;
      return this.getDynamicStyle(company, zoom);
    });
  });
}

private getDynamicStyle(company: CompanyAnalyticsDto, zoom: number): Style {
  const baseSize = Math.log(company.internshipCount + 1) * 2;
  return new Style({
    image: new Icon({
      src: 'assets/marker.png',
      scale: baseSize * (zoom / 15),
      color: this.getSectorColor(company.sector),
      anchor: [0.5, 1]
    }),
    text: new Text({
      text: zoom > 12 ? company.name : '',
      scale: 1.2,
      fill: new Fill({ color: '#2c3e50' }),
      stroke: new Stroke({ color: 'white', width: 3 })
    })
  });
}
  private getSectorColor(sector: string): string {
    const colors = {
      'EDUCATION': '#FF6B6B',
      'TECHNOLOGY': '#4CAF50',
      'FINANCE': '#2196F3',
      'HEALTHCARE': '#9C27B0'
    };
    return colors[sector] || '#666';
  }

  debugMarkers() {
    this.verifyAssets();
    console.log('Company coordinates:', this.companyCoordinates);
    console.log('Current features:', this.vectorLayer.getSource().getFeatures());
    this.map.getLayers().forEach(layer => {
      console.log('Layer:', layer);
    });
  }
  private verifyAssets() {
    console.log('Checking marker images:');
    console.log('ESPrit marker exists:', this.assetExists('assets/esprit-marker.png'));
    console.log('Default marker exists:', this.assetExists('assets/marker.png'));
  }
  private assetExists(path: string): boolean {
    // This is a simple check - you'll need to actually verify the files exist in your assets folder
    return true; // Replace with actual verification
  }
  private addEspritMarker() {
    const espritFeature = new Feature({
      geometry: new Point(this.espritLocation),
      isEspritLocation: true // Nouvelle propriété d'identification
    });

    espritFeature.setStyle(new Style({
      image: new Icon({
        src: 'assets/esprit-marker.png',
        scale: 0.8,
        anchor: [0.5, 1]
      }),
      text: new Text({
        text: 'ESPRIT\nMain Campus',
        offsetY: -40,
        textAlign: 'center',
        fill: new Fill({ color: '#2c3e50' }),
        stroke: new Stroke({ color: 'rgba(255,255,255,0.9)', width: 3 }),
        font: 'bold 12px Poppins'
      })
    }));

    this.vectorLayer.getSource().addFeature(espritFeature);
  }
}
