import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  Button, Text, Footer, FooterTab, Card, CardItem, Container, Body, Content, Icon, Fab, Thumbnail, Left
} from 'native-base';
import { Actions } from 'react-native-router-flux';
import MapView from 'react-native-maps';
import RNGooglePlaces from 'react-native-google-places';
import StarRating from 'react-native-star-rating';

import firebase, { logout } from '../../data/fbio';
import Loading from '../components/Loading'

const uberIcon   = require('../../assets/img/uber.png')
const searchIcon = require('../../assets/img/search.png')

const steps = {
  PICKUP: 'pickup',
  WAITING: 'waiting',
  ONWAY: 'onway',
  ONTRAVEL: 'ontravel',
  FINISHED: 'finished'
}

const deltas = {
  pickup: {
    latitudeDelta:  0.00922 * 1.5,
    longitudeDelta: 0.00421 * 1.5,
  },
  destination: {
    latitudeDelta:  0.00922 * 15,
    longitudeDelta: 0.00421 * 15,
  }
};

const driver = {
   "name": "Maria Perez",
   "profile_picture": "https://freedomfilm.my/wp-content/uploads/ultimatemember/28/profile_photo-120.jpg",
   "code": "LQO-32-08",
   "model": "Ford Ranger",
   "location": "19.699147, -101.237659",
   "in_use": false,
   "phone": 3320708099
  };

export default class Map extends Component {
    state = {
        step: steps.PICKUP,
        mapRegion: null,
        passengerLocation: null,
        ubers: null,
        type: 'x',
        gpsAccuracy: null,
        travelLocations: {
          pickup: {
            name: 'Cuál es tu ubicación?',
          },
          destination: {
            name: 'Cuál es tu destino?'
          }
        },
        driver: driver,
        menuActive: false
    }
    watchID = null

    componentWillMount() {
        this.watchID = navigator.geolocation.watchPosition((position) => {
            let region = {
                latitude:       position.coords.latitude,
                longitude:      position.coords.longitude,
                latitudeDelta:  0.00922*1.5,
                longitudeDelta: 0.00421*1.5,
            }

            this.onRegionChange(region, position.coords.accuracy);

            if (!this.state.passengerLocation) {
                let coords = {
                    latitude:  region.latitude,
                    longitude: region.longitude,
                }

                this.onPassengerLocationChange(coords);
            };
        });
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }

    onRegionChange(region, gpsAccuracy) {
        this.setState({
            mapRegion:   region,
            gpsAccuracy: gpsAccuracy || this.state.gpsAccuracy,
        });
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    randomNearbyPosition(coords) {
        return {
            latitude:  coords.latitude  + this.getRandomInt(-100,100)/10000,
            longitude: coords.longitude + this.getRandomInt(-100,100)/10000,
        }
    }

    generateRandomUbers(coords) {
        let ubers = {
            'pool' : [
                { id: 1,  type: 'pool',  name: 'Ana',       position: this.randomNearbyPosition(coords) },
                { id: 2,  type: 'pool',  name: 'John',      position: this.randomNearbyPosition(coords) },
                { id: 3,  type: 'pool',  name: 'Emely',     position: this.randomNearbyPosition(coords) },
                { id: 4,  type: 'pool',  name: 'Mike',      position: this.randomNearbyPosition(coords) },
                { id: 5,  type: 'pool',  name: 'Christene', position: this.randomNearbyPosition(coords) },
            ],
            'x' : [
                { id: 6,  type: 'x',     name: 'Alice',     position: this.randomNearbyPosition(coords) },
                { id: 7,  type: 'x',     name: 'Bob',       position: this.randomNearbyPosition(coords) },
                { id: 8,  type: 'x',     name: 'Leidi di',  position: this.randomNearbyPosition(coords) },
                { id: 9,  type: 'x',     name: 'Brayan',    position: this.randomNearbyPosition(coords) },
                { id: 10, type: 'x',     name: 'Nicol',     position: this.randomNearbyPosition(coords) },
            ],
            'black' : [
                { id: 11, type: 'black', name: 'Yimi',      position: this.randomNearbyPosition(coords) },
                { id: 12, type: 'black', name: 'Lou',       position: this.randomNearbyPosition(coords) },
                { id: 13, type: 'black', name: 'Yann',      position: this.randomNearbyPosition(coords) },
                { id: 14, type: 'black', name: 'Dominique', position: this.randomNearbyPosition(coords) },
                { id: 15, type: 'black', name: 'Tim',       position: this.randomNearbyPosition(coords) },
            ]
        };

        //console.log('this.state.type', this.state.type)
        //console.log('ubers[this.state.type]', ubers[this.state.type]);
        return ubers[this.state.type];
    }

    onPassengerLocationChange(coords) {
        this.setState({
            passengerLocation: coords,
            ubers: this.generateRandomUbers(coords),
        });

        //console.log(this.state.passengerLocation);
        //console.log(this.state.ubers);
    }

    updateTypeCallback() {
        this.setState({ubers: this.generateRandomUbers(this.state.passengerLocation)});
    }

    updateRegionCallback() {
        let coords = {
            latitude:  this.state.mapRegion.latitude,
            longitude: this.state.mapRegion.longitude,
        }
        this.onPassengerLocationChange(coords);
    }

    openSearchModal(name) {
      RNGooglePlaces.openAutocompleteModal({
        country: 'MX',
        latitude: this.state.passengerLocation.latitude,
        longitude: this.state.passengerLocation.longitude,
        radious: 5000
      })
      .then((place) => {
          console.log(place);

          let newRegion = {
              latitude:       place.latitude,
              longitude:      place.longitude,
              latitudeDelta:  deltas[name].latitudeDelta,
              longitudeDelta: deltas[name].longitudeDelta,
          }

          this.setState({mapRegion: newRegion}, this.updateRegionCallback);


  		  this.updateTravelLocation(name, place);
      })
      .catch(error => console.log(error.message));
    }

    updateTravelLocation(name, value) {
      const travelLocations = this.state.travelLocations;

      travelLocations[name] = value;

      console.log(travelLocations);

      this.setState({travelLocations});
    }

    async logOut() {
      await logout();

      Actions.auth();
    }

    assignDriver() {
      if(this.state.travelLocations.pickup.latitude && this.state.travelLocations.destination.latitude) {

        const ref = firebase.database().ref().child(`drivers/driver${Math.floor(Math.random() * 6) + 1  }`);

        ref.on('value', (snaptshot) => {

          const driver = snaptshot.val();

          this.setState({ step: steps.WAITING, driver });

          this.timeout = setTimeout(() => {
            this.setState({ step: steps.ONWAY});

            this.timeout = setTimeout(() => {
              this.setState({ step: steps.ONTRAVEL});

              this.timeout = setTimeout(() => {
                this.setState({ step: steps.FINISHED});
              }, 15000);

            }, 1000);

          }, 5000);

        });
      }
    }

    cancelTravel() {
      this.setState({ step: steps.PICKUP });
    }

    finishTravel() {
      this.timeout = setTimeout(() => {
        this.setState({ step: steps.PICKUP });
      }, 500);
    }

    getImage(name) {
      return require(`../images/${name}`);
    }

    render() {
        //Too much magic!!!!
        const { mapRegion, passengerLocation, ubers, gpsAccuracy} = this.state;
        //console.log('render()');
        //console.log('mapRegion: '        , mapRegion);
        //console.log('passengerLocation: ', passengerLocation);
        //console.log('gpsAccuracy: '      , gpsAccuracy);
        //console.log('ubers: '            , ubers);

        if (mapRegion && passengerLocation && ubers) {
            return (
                <View style={styles.container}>

                    <MapView style={styles.map} region={mapRegion}
                             loadingEnabled={true} loadingIndicatorColor="#999999"
                             onRegionChange={this.onRegionChange.bind(this)}>
                        <MapView.Marker draggable coordinate={passengerLocation}/>

                          {
                            Object.values(this.state.travelLocations).map((location) => {
                              if(location.latitude) {
                                return (
                                  <MapView.Marker draggable coordinate={location} key={location.name}/>
                                )
                              }
                            })
                          }

                        {ubers.map((uber, index) =>
                            <MapView.Marker title={uber.name} description={uber.type} image={uberIcon}
                            style={styles.uber} coordinate={uber.position} key={uber.id}/>
                        )}
                    </MapView>

                    <Content>
                      <Card>
                        <CardItem>
                          <Body>
                            <Button transparent primary onPress={() => this.openSearchModal('pickup')}>
                              <Text>
                                {this.state.travelLocations.pickup.name}
                              </Text>
                            </Button>
                          </Body>
                        </CardItem>
                      </Card>
                      <Card>

                        <CardItem>
                          <Body>
                            <Button transparent primary onPress={() => this.openSearchModal('destination')}>
                              <Text>
                                {this.state.travelLocations.destination.name}
                              </Text>
                            </Button>
                          </Body>
                        </CardItem>
                      </Card>

                    </Content>

                    <View style={styles.locations}>
                      <View style={styles.searchContainer}>

                      </View>

                      <View style={styles.searchContainer}>

                      </View>
                    </View>

                    { this.state.step === steps.PICKUP && (
                      <Footer>
                        <FooterTab>
                          <Button primary full onPress={() => this.assignDriver()}>
                              <Text>Pedir!</Text>
                          </Button>
                        </FooterTab>
                      </Footer>
                    )}
                    { this.state.step === steps.WAITING && (
                      <Footer>
                        <FooterTab>
                          <Button danger full onPress={() => this.cancelTravel()}>
                              <Text>Cancelar</Text>
                          </Button>
                        </FooterTab>
                      </Footer>
                    )}

                  { this.state.step === steps.ONWAY && (
                    <View style={styles.bottom}>
                      <Card>
                        <Content>
                          <CardItem>
                            <Left>
                              <Thumbnail source={{uri: this.state.driver.profile_picture}} />
                              <Body>
                                <Text> {this.state.driver.name} </Text>
                                <Text note>Está en camino</Text>
                              </Body>
                            </Left>
                          </CardItem>
                          <CardItem header>
                            <Icon name="md-car"></Icon>
                            <Text>{this.state.driver.model} {this.state.driver.code}</Text>
                          </CardItem>
                          <CardItem header>
                            <Icon name="md-call"></Icon>
                            <Text>{this.state.driver.phone}</Text>
                          </CardItem>
                          <CardItem header>
                            <Icon name="md-star"></Icon>
                            <Text>{this.state.driver.score}</Text>
                          </CardItem>
                        </Content>
                        <Button danger full onPress={() => this.cancelTravel()}>
                            <Text>Cancelar</Text>
                        </Button>
                      </Card>
                    </View>
                  )}

                  { this.state.step === steps.ONTRAVEL && (
                    <View style={styles.bottom}>
                      <Card>
                        <Content>
                          <CardItem>
                            <Left>
                              <Thumbnail source={{uri: this.state.driver.profile_picture}} />
                              <Body>
                                <Text> {this.state.driver.name} </Text>
                              <Text note>Viajando</Text>
                              </Body>
                            </Left>
                          </CardItem>
                          <CardItem header>
                            <Icon name="md-car"></Icon>
                            <Text>{this.state.driver.model} {this.state.driver.code}</Text>
                          </CardItem>
                          <CardItem header>
                            <Icon name="md-call"></Icon>
                            <Text>{this.state.driver.phone}</Text>
                          </CardItem>
                          <CardItem header>
                            <Icon name="md-star"></Icon>
                            <Text>{this.state.driver.score}</Text>
                          </CardItem>
                        </Content>
                      </Card>
                    </View>
                  )}

                  { this.state.step === steps.FINISHED && (
                    <View style={styles.bottom}>
                      <Card>
                        <Content>
                          <CardItem>
                            <Left>
                              <Thumbnail source={{uri: this.state.driver.profile_picture}} />
                              <Body>
                                <Text> {this.state.driver.name} </Text>
                              <Text note>Califica tu viaje</Text>
                              </Body>
                            </Left>
                          </CardItem>
                          <CardItem header>
                              <StarRating
                                disabled={false}
                                emptyStar={'ios-star-outline'}
                                fullStar={'ios-star'}
                                halfStar={'ios-star-half'}
                                iconSet={'Ionicons'}
                                maxStars={5}
                                rating={this.state.starCount}
                                selectedStar={(rating) => this.finishTravel()}
                                starColor={'yellow'}
                              />
                          </CardItem>
                        </Content>
                      </Card>
                    </View>
                  )}


                  <Fab
                        active={this.state.menuActive}
                        direction="up"
                        containerStyle={{ marginLeft: 50, marginBottom: 20 }}
                        style={{ backgroundColor: '#5067FF' }}
                        position="bottomRight"
                        onPress={() => this.setState({ menuActive: !this.state.menuActive })}>
                        <Icon name="md-reorder" />
                        <Button style={{ backgroundColor: '#DD5144' }}  onPress={this.logOut}>
                            <Icon name="md-log-out" />
                        </Button>
                        <Button style={{ backgroundColor: '#34A34F' }}>
                            <Icon name="md-car" />
                        </Button>
                        <Button style={{ backgroundColor: '#3B5998' }}>
                            <Icon name="md-person" />
                        </Button>
                    </Fab>

                </View>
            );
        } else {
            return (
                <Loading />
           );
        }
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    locations: {
      flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        //TODO >> find out a smarter way to make room for the location search bar
        //marginTop: 42,
    },
    uber: {
        flex:   1,
        width:  20,
        height: 20,
    },
    searchContainer: {
      flex: 1
    },
    bottom: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: 0
    }
});

const searchBarStyles = StyleSheet.create({
  textInputContainer: {
    backgroundColor: 'rgba(0,0,0,0)',
    borderTopWidth: 0,
    borderBottomWidth:0
  },
  textInput: {
    marginLeft: 0,
    marginRight: 0,
    height: 38,
    color: '#5d5d5d',
    fontSize: 16
  },
  predefinedPlacesDescription: {
    color: '#1faadb',
  },
  listView: {
    backgroundColor: 'white',
  },
  description: {
    fontWeight: 'bold',
  },
});
