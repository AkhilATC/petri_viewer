import { Component, ElementRef ,ViewChild} from '@angular/core';
import PetriNet from 'petri-js';
import * as MindFusion from 'diagram-library';
import AutoResize = MindFusion.Diagramming.AutoResize;
import Behavior = MindFusion.Diagramming.Behavior;
import Diagram = MindFusion.Diagramming.Diagram;
import { MatAccordion } from '@angular/material';
import { ApiserviceService } from './apiservice.service';
import {MatDialog} from '@angular/material/dialog';



import * as Common from "mindfusion-common";





@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  title = 'petri-ui';
  autoResize = AutoResize.None;
  behavior = Behavior.DrawShapes;
  ShapeNode = MindFusion.Diagramming.ShapeNode;
  Rect = MindFusion.Drawing.Rect;
  @ViewChild('accordion',{static:true}) Accordion: MatAccordion;

  public data = [];
  public state_node = [];
  public msg:any= "Petri Viewer";
  public petri_json_data;
  public firedNodes:any = [];
  
  
  
  diagram : Diagram;
  petrinet : PetriNet;
  hide_me=false;
  hide_me_canvas=false;
  view_demo = false;
  expand_first = false;
  expand_second = false;
  imported = false;
  quatity_value = '5';
   
  
  public constructor(public ApiService:ApiserviceService){
    this.diagram = new Diagram();
    this.data = [];
    this.diagram.setBackgroundImageUrl('assets/download1.png');
    
    
  }
ngOnInit(){ 
  
}
showMessage(message:String){
  this.msg = message;
}
startWorkSpace(){
  this.hide_me=true;
  this.hide_me_canvas = false;
  this.expand_first = true;
  this.expand_second = false;
  this.showMessage( 'Workspace initiated');
 
}
// depricated
addState(){
  var CompositeNode = MindFusion.Diagramming.CompositeNode;
    var StateNode = CompositeNode.classFromTemplate("StateNode",{
      component: "GridPanel",
      rowDefinitions: ["*"],
      columnDefinitions: ["22", "*"],
      children:[
                {
                component: "Rect",
                name: "State",
                pen: "black",
                brush: "white",
                columnSpan: 2,
                
              },
                {
                  component: "Image",
                  name: "Image",
                  autoProperty: true,
                  location: "/assets/state1.png",
                  margin: "1",
                  imageAlign: "Fit"
                 },
                 {
                  component: "StackPanel",
                  orientation: "Vertical",
                  gridColumn: 1,
                  margin: "1",
                  verticalAlignment: "Near",
                  children:[{
                  component: "Text",
                  name: "Title",
                  autoProperty: true,
                  text: "title",
                  font: "Arial bold",
                  textAlign: "center"
                 }]}
              
      ]
     });
     var node1 = new StateNode(this.diagram);
     node1.setBounds(new this.Rect(25, 15, 60, 25));
     node1.setTitle('State:'+this.state_node.length);
     this.diagram.addItem(node1);
     var name = 'State:'+this.state_node.length;
     var stateObj = {
       'id':this.state_node.length,
       'name':name,
       'node_type':'status',
       'inner_transitions':[],
       'outer_transitions':[]
                    }
    this.state_node.push(stateObj);
    this.showMessage('State node created.')
    

  }
// depricated
addTransition(){
    var CompositeNode = MindFusion.Diagramming.CompositeNode;
    var TransitionNode = CompositeNode.classFromTemplate("TransitionNode",{

      component: "GridPanel",
      rowDefinitions: ["*"],
      columnDefinitions: ["22", "*"],
      children:[
                {
                component: "Rect",
                name: "Transition",
                pen: "black",
                brush: "white",
                columnSpan: 2
              },
                {
                  component: "Image",
                  name: "Image",
                  autoProperty: true,
                  location: "/assets/transition.png",
                  margin: "1",
                  imageAlign: "Fit"
                 },
                 {
                  component: "StackPanel",
                  orientation: "Vertical",
                  gridColumn: 1,
                  margin: "1",
                  verticalAlignment: "Near",
                  children:[{
                  component: "Text",
                  name: "Title",
                  autoProperty: true,
                  text: "title",
                  font: "Arial bold",
                  textAlign: "center"
                 }]}
              
      ]
     });
     var node1 = new TransitionNode(this.diagram);
     node1.setBounds(new this.Rect(25, 15, 60, 25));
     node1.setTitle('Transition:'+this.data.length);
     this.diagram.addItem(node1);
     var transition_obj = {
       'name':'Transition:'+this.data.length,
       'id':this.data.length,
       'node_type':'transition'
     }
     this.data.push(transition_obj)
     this.msg = 'Transition node created.'
     
  }
// depricated
nodeCreated($event){
  console.log("node Created")
  //console.log($event.args.link)
  var origin = $event.args.link.origin.namedComponents.Title.text;
  var destination = $event.args.link.destination.namedComponents.Title.text;

  for(var each in this.state_node){
    
    if(this.state_node[each].name === origin){
      var result = this.data.filter(x => x.name === destination);
      this.state_node[each].outer_transitions.push(result[0])

    }
    if(this.state_node[each].name === destination){
      var result = this.data.filter(x => x.name === destination);
      this.state_node[each].inner_transitions.push(result[0])
    }
  }
  
}// depricated
textEdited($event){
  console.log('text-edited');
  

  
}// depricated
onNodeDoubleClicked($event){
  console.log("on Node Double Clicked");
  console.log($event);
}
importJson(){
  this.hide_me_canvas = true;
  this.hide_me = false;
  this.view_demo = false;
  this.expand_first = false;
  this.expand_second =true;
  this.showMessage('Working with json file: Display & proccess PetriNets');
}

showPetriDiagram(data_){
  // show petri diagram
  this.view_demo = true;
  const model = data_;
  this.petrinet = new PetriNet(document.getElementById('inner_canvas'), model,{
    fireSemantics: {
    // isFireable: (t, making) => {
    // console.log("is firable")
    // // console.log(t)
    // // console.log(making)
    // return true;
    // },
    fire: (t, marking) => {
  
    const pre = t.preconditions
    const post = t.postconditions
    
    const nextMarking = {}
    console.log("markings  are");
    console.log(marking);
    this.firedNodes = [];
    for (const p in marking) {
    if (!marking.hasOwnProperty(p)) {
    throw new Error(
    `'${p}' is precondition of '${t.name}' but doesn't appear in marking '${marking}'.`)
    }
    if(t.hasOwnProperty('guardFunction')){
      console.log("-----+++++++++ guardFunction ++++++++++++");
      // debugger;
      console.log(t.guardFunction);

      var nodeList = [];
      var elseNodes = [];
      for (const [key, value] of Object.entries(t.guardFunction)) {
        // console.log(`${key}: ${value}`);
        let new_str = value.toString().replace('qty',this.quatity_value);
        const nodeInfo = {'node':key,'logic':new_str}
          if(eval(new_str)){
            nodeList.push(key);
            nodeInfo['action'] = true;
            
          }else{
            elseNodes.push(key);
            nodeInfo['action'] = false;
          }
          // debugger;
          
          if (!this.firedNodes.some(({node}) => node === key)) {
           
            this.firedNodes.push(nodeInfo)
          }
      }
     if(nodeList.includes(p) && !elseNodes.includes(p)){
      nextMarking[p] = (marking[p] || 0) - (pre[p] || 0) + (post[p] || 0)
     }else if(!nodeList.includes(p) && elseNodes.includes(p)){
      nextMarking[p] = (marking[p] || 0) 
     }else{
      nextMarking[p] = (marking[p] || 0) - (pre[p] || 0) + (post[p] || 0)
     } 
    }else{

      nextMarking[p] = (marking[p] || 0) - (pre[p] || 0) + (post[p] || 0)
    }
   
    if (nextMarking[p] < 0) {
    throw new Error(`'${t.name}' is not fireable`)
    }
    // console.log(arrayList)
    }
    return nextMarking
    }
    }
    });
  // console.log(petrinet.marking())

}
importPetri($event){
  console.log("import petri")
  var file = $event.target.files[0];
  let json_data;  
  
  if(file){
    
    var reader =   new FileReader();
    reader.readAsText(file,"UTF-8");
    reader.onload = (eve:Event) =>{
      json_data = JSON.parse(eve.target['result']);
      this.petri_json_data = json_data; 
      // this.showPetriDiagram(this.petri_json_data);
      this.imported = true;
      console.log(json_data);
      }
    reader.onerror = (eve:Event)=>{
      this.showMessage('Failed to load preview 😞 ')
    }
    reader.onabort=(eve:Event)=>{
      this.showMessage('Failed to load preview 😞 ')

    }
  }
}
setToken(selected){
  console.log("----- set token ---")
  
  Object.keys(this.petri_json_data.m0).forEach(v => this.petri_json_data.m0[v] = 0)
  this.petri_json_data.m0[selected] = 1
  console.log('ddddd-')
  console.log(selected);
  console.log(this.petri_json_data)
  // this.petrinet = new PetriNet(document.getElementById('inner_canvas'),this.petri_json_data)

}
viewPreview(){
  this.showPetriDiagram(this.petri_json_data);

}

}
