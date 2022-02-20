import React, { useState } from 'react'
import { useEffect } from 'react'
import GoogleMapReact from 'google-map-react'
import Image from 'next/image'
import axios from 'axios'
import { useRef } from 'react'

const AnyReactComponent = ({ text, type }) => {
  let imgSrc = ''

  switch (type) {
    case 'dc_fast':
      imgSrc = '/img/dc_fast.png'
      break
    case 'supercharger':
      imgSrc = '/img/supercharger.png'
      break
    case 'lvl2':
      imgSrc = '/img/lvl_2.png'
      break
    case 'car':
      imgSrc = '/img/car.png'
      break
  }

  ;<div>
    <img src={imgSrc} width={75} height={75} />
  </div>
}

export default function MapSecondary({ userData }) {
  const [lat, setLat] = useState(0)
  const [long, setLong] = useState(0)
  const [loading, setLoading] = useState(true)
  const [address, setAddress] = useState('')

  const [mapObj, setMapObj] = useState(null)

  const [markers, setMarkers] = useState([
    {
      lat: lat,
      lng: long,
      text: 'Your car',
      type: 'car',
    },
  ])

  const [actualMapMarkers, setMapMarkers] = useState([])

  const [directionsService, setDirectionsService] = useState(null)
  const [directionsDisplay, setDirectionsDisplay] = useState(null)

  const [chargingStations, setChargingStations] = useState([])

  const resetMarkers = () => {
    console.log(lat, long)
    setMarkers([
      {
        lat: lat,
        lng: long,
        text: 'Your car',
        type: 'car',
      },
    ])

    actualMapMarkers.forEach((mapMarker) => {
      console.log('Map marker', mapMarker)
      mapMarker.setMap(null)
      mapMarker = null
    })
    setMapMarkers([])
  }

  const getCoordinates = (position) => {
    setLat(position.coords.latitude)
    setLong(position.coords.longitude)
    setLoading(false)
  }

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getCoordinates)
    } else {
      alert('Geolocation not supported or needs permission to access.')
    }
  }

  const handleAddress = async (e) => {
    resetMarkers()
    console.log('Actual map markers: ', actualMapMarkers)

    const currLocation = address ? address : [lat, long]
    let lvl2Charger, dcFastCharger, supercharger

    try {
      // Send request to three endpoints regarding charging station
      lvl2Charger = (
        await axios.post(
          'https://calgaryhacks-2022-charge.herokuapp.com/api/findBestLevel2Charger',
          {
            batteryToFill: userData.car.batterySize,
            currLocation: currLocation,
          }
        )
      ).data

      dcFastCharger = (
        await axios.post(
          'https://calgaryhacks-2022-charge.herokuapp.com/api/findBestDCFastCharger',
          {
            batteryToFill: userData.car.batterySize,
            currLocation: currLocation,
          }
        )
      ).data

      supercharger = (
        await axios.post(
          'https://calgaryhacks-2022-charge.herokuapp.com/api/findBestSupercharger',
          {
            batteryToFill: userData.car.batterySize,
            currLocation: currLocation,
          }
        )
      ).data
    } catch (err) {
      alert("Sorry, it seems like your location isn't supported yet :( Please try again with another location!")
      console.log("Error with getting charging stations: ", err)
      return
    }

    lvl2Charger.chargerType = 'Level 2'
    dcFastCharger.chargerType = 'DC Fast'
    supercharger.chargerType = 'Supercharger'

    // Get the one with the shortest time
    const bestCharger = [
      { type: 'level2', data: lvl2Charger },
      { type: 'dcFast', data: dcFastCharger },
      { type: 'supercharger', data: supercharger },
    ].sort((a, b) => a.data.net_time - b.data.net_time)[0]

    console.log('Best charger', bestCharger)

    // Show the route for the one with the shortest time
    // Add the markers for the charging station
    setMarkers([
      {
        lat: lat,
        lng: long,
        text: 'Your car',
        type: 'car',
      },
      {
        lat: lvl2Charger.fuel_station.location.coordinates[0],
        lng: lvl2Charger.fuel_station.location.coordinates[1],
        text: 'Level 2 Station',
        type: 'lvl2',
      },
      {
        lat: supercharger.fuel_station.location.coordinates[0],
        lng: supercharger.fuel_station.location.coordinates[1],
        text: 'Supercharger',
        type: 'supercharger',
      },
      {
        lat: dcFastCharger.fuel_station.location.coordinates[0],
        lng: dcFastCharger.fuel_station.location.coordinates[1],
        text: 'DC Fast',
        type: 'dc_fast',
      },
    ])

    setChargingStations(
      [lvl2Charger, supercharger, dcFastCharger].sort(
        (a, b) => a.net_time - b.net_time
      )
    )
    console.log(
      [lvl2Charger, supercharger, dcFastCharger].sort(
        (a, b) => a.net_time - b.net_time
      )
    )

    calculateAndDisplayRoute(
      new google.maps.LatLng(lat, long),
      new google.maps.LatLng(
        bestCharger.data.fuel_station.location.coordinates[0],
        bestCharger.data.fuel_station.location.coordinates[1]
      )
    )

    /*
    if (mapObj) {
      markers.map((markerInfo) => {
        setMapMarkers(actualMapMarkers.concat(new google.maps.Marker({
          position: new google.maps.LatLng(markerInfo.lat, markerInfo.lng),
          map: mapObj,
          icon: markerInfo.type === "car" ? '/img/car.png' : '/img/chargingStation.png',
        })))
      }) 
    }
    */

    // Display all three in a list
  }

  function calculateAndDisplayRoute(pointA, pointB) {
    directionsService.route(
      {
        origin: pointA,
        destination: pointB,
        avoidTolls: true,
        avoidHighways: false,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response)
        } else {
          window.alert('Directions request failed due to ' + status)
        }
      }
    )
  }

  useEffect(() => {
    getLocation()
    console.log(lat, long)
    /*
    setMarkers([
      {
        lat: lat,
        lng: long,
        text: 'Your car',
        type: 'car',
      },
    ])
    */

    console.log('Map obj', mapObj)

    if (mapObj) {
      console.log('Markers in useEffect', markers)
      /*
      actualMapMarkers.forEach(mapMarker => { console.log("Map marker", mapMarker); mapMarker.setMap(null); mapMarker = null })
      setMapMarkers([])
      */

      markers.reverse()

      markers.map((markerInfo) => {
        let imgSrc
        switch (markerInfo.type) {
          case 'dc_fast':
            imgSrc = '/img/dc_fast.png'
            break
          case 'supercharger':
            imgSrc = '/img/supercharger.png'
            break
          case 'lvl2':
            imgSrc = '/img/lvl_2.png'
            break
          case 'car':
            imgSrc = '/img/car.png'
            break
        }

        setMapMarkers(
          actualMapMarkers.concat(
            new google.maps.Marker({
              position: new google.maps.LatLng(markerInfo.lat, markerInfo.lng),
              map: mapObj,
              icon: imgSrc,
            })
          )
        )
      })

      setDirectionsService(new google.maps.DirectionsService())
      setDirectionsDisplay(
        new google.maps.DirectionsRenderer({
          map: mapObj,
        })
      )
    }
  }, [lat, long, mapObj, markers])

  const handleApiLoaded = (map, maps) => {
    // use map and maps objects
    console.log('Map:', map)
    console.log('Maps:', maps)

    setMapObj(map)
  }

  return !loading ? (
    <>
      {chargingStations.length > 0 && (
        <div className="w-1/5 bg-white p-4 rounded-3xl">
          <h1 className="text-lg font-bold mb-4">Charging Stations</h1>
          <div className="flex flex-col gap-4">
            {chargingStations.map((chargingStation) => (
              <div className="flex flex-col">
                <div className="flex justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="text-md font-bold">
                      {chargingStation.fuel_station.name}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">Address:</span>{' '}
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${chargingStation.fuel_station.location.address}`}
                        className="text-blue-400 hover:text-blue-600"
                        rel="noreferrer"
                        target="_blank"
                      >
                        {chargingStation.fuel_station.location.address}
                      </a>
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">Phone Number:</span>{' '}
                      <a
                        href={`tel:${chargingStation.fuel_station.phone_number}`}
                        className="text-blue-400 hover:text-blue-600"
                      >
                        {chargingStation.fuel_station.phone_number}
                      </a>
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">Charger Type:</span>{' '}
                      {chargingStation.chargerType}
                    </div>
                    {Math.floor(chargingStation.net_time) > 0 ? (
                      <div className="text-sm">
                        <span className="font-semibold">Net time:</span>{' '}
                        {Math.floor(chargingStation.net_time)} hours and{' '}
                        {Math.floor(chargingStation.net_time * 60) % 60} minutes
                      </div>
                    ) : (
                      <div className="text-sm">
                        <span className="font-semibold">Net time:</span>{' '}
                        {Math.floor(chargingStation.net_time * 60) % 60} minutes
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="w-full lg:w-5/6 bg-white p-4 rounded-3xl">
        <div className="flex justify-center items-center h-full">
          <div className="w-full h-full">
            {/* <MapContainer startingLocation={{ lat: 0, lng: 0 }}/> */}

            <div className="w-full h-full">
              <div className="flex gap-4">
                <input
                  className="w-5/6 h-15 mb-2 border mt-1 rounded-md p-1 px-2"
                  placeholder="Manually enter an address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <button
                  className="w-1/6 h-15 mb-2 border mt-1 rounded-md p-1 px-2 bg-teal-200 hover:bg-teal-300"
                  onClick={handleAddress}
                >
                  Search
                </button>
              </div>

              <div style={{ height: '93%', width: '100%' }}>
                <GoogleMapReact
                  /*
            DONT FORGET TO DELETE API KEY FROM REPO      
        */
                  bootstrapURLKeys={{
                    key: 'AIzaSyA-2hrkZS4W_t37X-iYVB4XmeDwwmZC1Dk',
                  }}
                  defaultCenter={{
                    lat,
                    lng: long,
                  }}
                  defaultZoom={13}
                  yesIWantToUseGoogleMapApiInternals
                  onGoogleApiLoaded={({ map, maps }) =>
                    handleApiLoaded(map, maps)
                  }
                >
                  {/*
          {markers.map((markerInfo, index) => (                                      
            
            <AnyReactComponent
              lat={markerInfo.lat}
              lng={markerInfo.lng}
              text={markerInfo.text}
              type={markerInfo.type}
              />                                                    
            
          ))}
          */}
                </GoogleMapReact>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <div>Loading...</div>
  )
}
