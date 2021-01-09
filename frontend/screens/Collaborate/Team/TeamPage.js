import React, { Component } from 'react';
import { View, ScrollView, Pressable, Image, TouchableWithoutFeedback, KeyboardAvoidingView, Modal } from 'react-native';

import BackHeader from '../../components/BackHeader.js';
import CreateProjectView from '../Project/CreateProjectView.js';

import { Text, Button, Input, Icon, Popover, Divider, List, ListItem, Card } from '@ui-kitten/components';
import styles from '../collaborateStyles.js';

class TeamPage extends Component {

    constructor(props){
        super(props);

        this.state = { // these values are for example
            data: [{
                title: 'Project Name',
                location: {
                    "timestamp": 0,
                    "coords": {
                      "accuracy": -1,
                      "altitude": -1,
                      "altitudeAccuracy": -1,
                      "heading": -1,
                      "latitude": 28.602413253152307,
                      "longitude": -81.20019937739713,
                      "speed": 0
                    }
                },
                area: [
                  {
                    "latitude": 28.60281064892976,
                    "longitude": -81.20062004774809,
                  },
                  {
                    "latitude": 28.601854567009166,
                    "longitude": -81.2006676569581,
                  },
                  {
                    "latitude": 28.60175654457185,
                    "longitude": -81.19934029877186,
                  },
                ]
            }],
            createProject: false,
            tempProjectName: ' ',
            tempLocation: {
                "timestamp": 0,
                "coords": {
                  "accuracy": -1,
                  "altitude": -1,
                  "altitudeAccuracy": -1,
                  "heading": -1,
                  "latitude": 28.602413253152307,
                  "longitude": -81.20019937739713,
                  "speed": 0
                }
            },
            tempArea: []
        }
        this.openPrevPage = this.openPrevPage.bind(this);
        this.openProjectPage = this.openProjectPage.bind(this);

        // Creating a new Project
        this.onOpenCreateProject = this.onCreateProject.bind(this, true, false);
        this.onDismissCreateProject = this.onCreateProject.bind(this, false, false);
        this.onCreateNewProject = this.onCreateProject.bind(this, false, true);
        this.addNewProject = this.addNewProject.bind(this);
        this.setTempProjectName = this.setTempProjectName.bind(this);
        this.addMarker = this.addMarker.bind(this);
        this.removeMarker = this.removeMarker.bind(this);
    }

    openPrevPage() {
        this.props.navigation.navigate("Collaborate");
    }

    openProjectPage(item) {
        this.props.setSelectedProject(item);
        this.props.navigation.navigate("ProjectPage");
    }

    setTempProjectName(event) {
        this.setState({
            tempProjectName: event
        });
    }

    addMarker(coordinates) {
        let temp = {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude
         };
        this.state.tempArea.push(temp);
        this.setState({
          tempArea: this.state.tempArea
        });
    }

    removeMarker(marker, index) {
      this.state.tempArea.splice(index, 1);
      this.setState({
        tempArea: this.state.tempArea
      });
    }

    onCreateProject(visible, submit) {
        if (visible) {
            this.setState({
                createProject: true
            });
        } else {
            if (submit) {
                let goodName = this.state.tempProjectName.trim().length !== 0;
                let goodArea = this.state.tempArea.length > 2;
                if (goodName && goodArea) {
                   this.addNewProject(this.state.tempProjectName.trim(),
                                      this.state.tempArea);
                   this.setState({
                       createProject: false,
                       tempProjectName: ' ',
                       tempArea: []
                   });
                }
                if(!goodName){
                    console.log("TeamPage.js: Need to enter a Project Name");
                }
                if(!goodArea){
                    console.log("TeamPage.js: Need at least 3 points");
                }
            } else {
                this.setState({
                    createProject: false,
                    tempProjectName: ' ',
                    tempArea: []
                });
            }
        }
    }

    addNewProject(projectName, projArea) {
        let temp = {
            title: projectName,
            location: { // This just takes the first point, should probably calculate center point
                    "coords":{
                        "latitude": projArea[0].latitude,
                        "longitude":projArea[0].longitude,
                        "altitude": -1,
                        "heading": -1}
                    },
            area: projArea
        };
        this.state.data.push(temp);
        this.setState({
            data: this.state.data
        });
    }

    render() {

        const ForwardIcon = (props) => (
          <Icon {...props} name='arrow-ios-forward'/>
        );

        const renderItem = ({ item, index }) => (
            <ListItem
              title=<Text style={{fontSize:20}}>
                        {`${item.title}`}
                    </Text>
              accessoryRight={ForwardIcon}
              onPress={() => this.openProjectPage(item)}
            />
        );

        return(
            <View style={styles.container}>
                <BackHeader headerText={this.props.getSelectedTeam().title} prevPage={this.openPrevPage}/>

                <CreateProjectView
                        createProject={this.state.createProject}
                        setTempProjectName={this.setTempProjectName}
                        onCreateNewProject={this.onCreateNewProject}
                        onDismissCreateProject={this.onDismissCreateProject}
                        location={this.state.tempLocation}
                        markers={this.state.tempArea}
                        addMarker={this.addMarker}
                        removeMarker={this.removeMarker}
                    />

                <View style={styles.teamTextView}>
                    <View style={{flexDirection:'column', justifyContent:'flex-end'}}>
                        <Text style={styles.teamText}> Projects </Text>
                    </View>
                    <View style={styles.createTeamButtonView}>
                        <Button status='primary' appearance='outline' onPress={this.onOpenCreateProject}>
                            Create New
                        </Button>
                    </View>
                </View>
                <Divider style={{marginTop: 5}} />

                <View style={{flexDirection:'row', justifyContent:'center', maxHeight:'50%', marginTop:15}}>
                    <List
                      style={{maxHeight:'100%', maxWidth:'90%'}}
                      data={this.state.data}
                      ItemSeparatorComponent={Divider}
                      renderItem={renderItem}
                    />
                </View>


            </View>
        );
    }
}

export default TeamPage;