import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf'
import { ServicesService } from 'src/services/services.service';
import { WebData } from '../services/web-data.dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  formgroup1:FormGroup;
  constructor(private dataService: ServicesService,private fb:FormBuilder  ){
   
    this.formgroup1=this.fb.group({
      address:['',[Validators.required]],
      pin:['',Validators.required],
      phone:['',Validators.required],
    })

  }

  getControl(control){
    return this.formgroup1.controls[control];
  }

  submit(value){
    if(this.formgroup1.valid){
      const coordinatesData=JSON.parse(localStorage.getItem('coordinates'));
      let newObj={
        ...value,
      location:{type:"Polygon",coordinates:[coordinatesData]}
      }
      this.dataService.postData(newObj).subscribe((x: WebData)=>{
        if(x){
        
          alert("success");
          this.formgroup1.reset();
        }
    },err=>{
      console.log(err);
    })
    }else{

      this.formgroup1.markAllAsTouched();
    }
   }
   
   checkLocalData(){
         if(!localStorage.getItem('coordinates')){
           return true;
         }
         else {
           return false;
         }
   }

   lat=77.2664587;
  log=28.5366411
  ngOnInit(){

    localStorage.clear();
    Object.getOwnPropertyDescriptor(mapboxgl, "accessToken").set(environment.mapboxkey);
    // mapboxgl.accessToken = 'pk.eyJ1IjoidGVzdGluZ2FsbW9uZHoiLCJhIjoiY2t3ZzZlYnlwMGxlcTJ1cXZ3cDM1ZDZ5ZCJ9.LTpVQRAL-OhcTw1lgQlgJg';
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v11', // style URL
        center: [this.lat,this.log], // starting position [lng, lat]
        zoom: 12 // starting zoom
    });
    
    const draw = new MapboxDraw({
      displayControlsDefault: false,
      // Select which mapbox-gl-draw control buttons to add to the map.
      controls: {
          polygon: true,
          trash: true
      },
      // Set mapbox-gl-draw to draw by default.
      // The user does not have to click the polygon control button first.
      defaultMode: 'draw_polygon'
  });
   
  map.addControl(draw);

  map.on('draw.create', updateArea);
  map.on('draw.delete', updateArea);
  map.on('draw.update', updateArea);
  
  
  function updateArea(e) {
     
      const data:any = draw.getAll();
      let polyCoord = turf.coordAll(data);
      // console.log("hello",polyCoord);
      // let newData=localStorage.setItem('coordinates',JSON.stringify(polyCoord));
      localStorage.setItem('coordinates',JSON.stringify(polyCoord));
      // let data1=JSON.parse(localStorage.getItem('coordinates'));
      // console.log("new data",data1);

      const answer = document.getElementById('calculated-area');
      if (data.features.length > 0) {
          const area = turf.area(data);
          let centroid = turf.centroid(data);
          var center = [centroid.geometry.coordinates[1],centroid.geometry.coordinates[0]];
          // Restrict the area to 2 decimal points.
          const rounded_area = Math.round(area * 100) / 100;
          answer.innerHTML = `<p><strong>Centroid: <br />
          ${centroid.geometry.coordinates[1]},${centroid.geometry.coordinates[0]}</strong></p>`;
         
       
         
        //  console.log("corrdinates data",coordinatesData);
        
        
     
    }
     
  
          
      else {
          answer.innerHTML = '';
          if (e.type !== 'draw.delete')
              alert('Click the map to draw a polygon.');
      }
     
      
}
     


}}
