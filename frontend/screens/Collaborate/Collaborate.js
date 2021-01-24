import React, { Component } from 'react';
import { View, ScrollView, Pressable, Image, TouchableWithoutFeedback, KeyboardAvoidingView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MyHeader from '../components/Headers/MyHeader.js';
import CreateTeamCard from './Team/CreateTeamCard.js';

import { Text, Button, Input, Icon, Popover, Divider, List, ListItem, Card } from '@ui-kitten/components';
import styles from './collaborateStyles.js';

class Collaborate extends Component {

    constructor(props){
        super(props);

        this.state = {
            data: JSON.parse(props.teams),
            createTeam: false,
            tempTeamName: ' '
        }
        this.onOpenCreateTeam = this.onCreateTeam.bind(this, true, false);
        this.onDismissCreateTeam = this.onCreateTeam.bind(this, false, false);
        this.onCreateNewTeam = this.onCreateTeam.bind(this, false, true);
        this.addNewTeam = this.addNewTeam.bind(this);
        this.setTempTeamName = this.setTempTeamName.bind(this);
        this.openTeamPage = this.openTeamPage.bind(this);
    }

    setTempTeamName(event) {
        this.setState({
            tempTeamName: event
        });
    }

    async onCreateTeam(visible, submit) {
        if (visible) {
            this.setState({
                createTeam: true
            });
        } else {
            if (submit && this.state.tempTeamName.trim().length !== 0) {
                this.addNewTeam(this.state.tempTeamName.trim());
            }
            this.setState({
                createTeam: false,
                tempTeamName: ' '
            });
        }
    }

    async addNewTeam(teamName) {
        let token = await AsyncStorage.getItem("@token")
        let id = await AsyncStorage.getItem("@id")
        let teams = null
        // Save the new team
        try {
            const response = await fetch('https://measuringplacesd.herokuapp.com/api/teams/', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({
                    title: teamName,
                    description: "description"
                })
            })
        } catch (error) {
            console.log("error", error)
        }
        // Get the list of teams
        await fetch('https://measuringplacesd.herokuapp.com/api/users/' + id, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
            }
        })
        .then((response) => (response.json()))
        .then(async (res) => (
                teams = JSON.stringify(res.teams),
                await AsyncStorage.setItem("@teams", teams)
            ))
        .catch((error) => (console.log(error)))
        // Update
        await this.props.updateTeams(JSON.parse(teams));
        await this.setState({
            data: this.props.teams
        });
        console.log("teams: ");
        console.log(this.state.data);
    }

    openTeamPage(item) {
        this.props.setSelectedTeam(item);
        this.props.navigation.navigate("TeamPage");
    }

    render() {

        const ForwardIcon = (props) => (
          <Icon {...props} name='arrow-ios-forward'/>
        );

        const renderItem = ({ item, index }) => (
            <ListItem
              title={
                    <Text style={{fontSize:20}}>
                        {`${item.title}`}
                    </Text>}
              accessoryRight={ForwardIcon}
              onPress={() => this.openTeamPage(item)}
            />
        );

        const popUpAnchor = () => (
            <Divider style={{marginTop: 5}} />
        );

        return(
            <View style={styles.container}>

                <MyHeader myHeaderText={"Collaborate"}/>

                <View style={styles.teamTextView}>
                    <View style={{flexDirection:'column', justifyContent:'flex-end'}}>
                        <Text style={styles.teamText}> Teams </Text>
                    </View>
                    <View style={styles.createTeamButtonView}>
                        <Button status='primary' appearance='outline' onPress={this.onOpenCreateTeam}>
                            Create New
                        </Button>
                    </View>
                </View>

                <Popover
                    visible={this.state.createTeam}
                    backdropStyle={styles.backdrop}
                    onBackdropPress={this.onDismissCreateTeam}
                    anchor={popUpAnchor}>

                    <CreateTeamCard setTempTeamName={this.setTempTeamName}
                                    onCreateNewTeam={this.onCreateNewTeam}/>
                </Popover>

                <View style={{flexDirection:'row', justifyContent:'center', maxHeight:'50%', marginTop:15}}>
                    <List
                      style={{maxHeight:'100%', maxWidth:'90%'}}
                      data={this.state.data}
                      ItemSeparatorComponent={Divider}
                      renderItem={renderItem}
                    />
                </View>

                <View style={styles.teamTextView}>
                    <View style={{flexDirection:'column', justifyContent:'flex-end'}}>
                        <Text style={styles.teamText}> Invites </Text>
                    </View>
                </View>
                <Divider style={{marginTop: 5}} />
            </View>
        );
    }
}

export default Collaborate;
