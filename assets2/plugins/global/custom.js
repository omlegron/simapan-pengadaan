$(document).ready(function() {
    // window.userModal = {}
    // window.userModal = Object.assign(
    //     {},
    //     {
    //         userModal: $('#filterModal'),
    //         userModalSearchForm: $('#users-modal-search-form'),
    //         showUserModal: function() {
    //             const loadModal = this.loadUserModal,
    //                 url = this.userModal.data('url'),
    //                 search_url = this.userModal.data('search_url')

    //             const data = { url, search_url }

    //             this.userModal.modal('show')

    //             this.userModal.on('shown.bs.modal', function() {
    //                 loadModal(data, false)
    //             })

    //             this.userModal.on('hide.bs.modal', function() {
    //                 loadModal(data, false).destroy()
    //             })

    //             let typingTimer,
    //                 doneTypingInterval = 300

    //             this.userModalSearchForm.on('input', function(e) {
    //                 clearTimeout(typingTimer)
    //                 typingTimer = setTimeout(function() {
    //                     loadModal(data, false).destroy()
    //                     loadModal(data, true, e.target.value)
    //                 }, doneTypingInterval)
    //             })
    //         },
    //         loadUserModal: function(data, onSearch, searchValue) {

    //             console.log('fire')

    //             const csrf_token = $('meta[name="csrf-token"]').attr('content')

    //             let filterUrl = {
    //                 url: data.url,
    //                 type: 'GET',
    //             }

    //             if (onSearch) {
    //                 filterUrl = {
    //                     url: data.search_url,
    //                     type: 'POST',
    //                     dataType: 'json',
    //                     data: {
    //                         _token: csrf_token,
    //                         search: searchValue,
    //                     },
    //                 }
    //             }

    //             return $('#users-modal-table').DataTable({
    //                 processing: true,
    //                 serverSide: true,
    //                 ajax: {
    //                     ...filterUrl,
    //                 },
    //                 columns: [
    //                     { data: 'name', name: 'name' },
    //                     { data: 'identity_number', name: 'identity_number' },
    //                 ],
    //                 language: {
    //                     processing: `<div class="spinner-border text-primary" role="status">
    //                         <span class="sr-only">Loading...</span>
    //                     </div>`,
    //                 },
    //                 dom: 'rtp',
    //                 retrieve: true,
    //                 columnDefs: [
    //                     {
    //                         targets: 0,
    //                         searchable: false,
    //                         orderable: false,
    //                     },
    //                 ],
    //             })
    //         },
    //         onClickUserModalRow: function(cb) {
    //             const loadModal = this.loadUserModal
    //             const modal = this.userModal

    //             $('#users-modal-table').on('click', 'tbody tr', function() {
    //                 console.log('firing')

    //                 const dataUrl = $('#users-modal-table').data('url')
    //                 let data = { url: dataUrl }
    //                 const row = loadModal(data, false).row($(this)).data()

    //                 $('.form-user-filter').val(row.name)
    //                 $('.form-user-filter').attr('id', row.id)
                    
    //                 cb()
    //             });

    //             // let promise = new Promise(function(resolve, reject) {
    //             //     $('#users-modal-table').on('click', 'tbody tr', function() {
    //             //         console.log('firing')

    //             //         const dataUrl = $('#users-modal-table').data('url')
    //             //         let data = { url: dataUrl }
    //             //         const row = loadModal(data, false).row($(this)).data()
    
    //             //         $('.form-user-filter').val(row.name)
    //             //         $('.form-user-filter').attr('id', row.id)

    //             //         resolve('done');

    //             //     });
    //             // });

    //             // promise.then(r => {
    //             //     modal.modal('hide')
    //             //     cb()
    //             // })
    //         },
    //     }
    // );

    window.gMap = {}
    window.gMap = Object.assign(
        {},
        {
            map: {},
            infowindow: {},
            autocomplete: {},
            marker: {},
            geocoder: {},
            mapIcon: 'img/geocode.png',
            center: {},
            initMap: function() {

                let input, 
                    mapElem,
                    infowindowContent,
                    mapOptions = {
                        center: {
                            lat: -6.90389, 
                            lng: 107.61861
                        },
                        zoom: 17,
                        icon: 'img/geocode.png' 
                    }

                input = document.getElementById('pac-input')
                mapElem = document.getElementById('gmap')
                infowindowContent = document.getElementById('infowindow-content')

                this.map = new google.maps.Map(mapElem, {
                    center: mapOptions.center,
                    zoom: mapOptions.zoom,
                })
                this.marker = new google.maps.Marker({
                    map: this.map,
                    draggable: true,
                    animation: google.maps.Animation.DROP,
                    position: mapOptions.center,
                    cursor: 'move'
                })
                this.autocomplete = new google.maps.places.Autocomplete(input)
                this.infowindow = new google.maps.InfoWindow()
                this.geocoder = new google.maps.Geocoder()

                const map = this.map
                const autocomplete = this.autocomplete
                const marker = this.marker
                const infowindow = this.infowindow
                const geocoder = this.geocoder
                const getLocation = this.getLocation
                const setInfoWindowContent = this.setInfoWindowContent
                const icon = this.mapIcon

                this.getCurrentLocation(infowindow, map, function(pos){
                    getLocation(map, marker, infowindow, geocoder, setInfoWindowContent, infowindowContent, icon, pos)
                })

                // Bind the map's bounds (viewport) property to the autocomplete object,
                // so that the autocomplete requests use the current map bounds for the
                // bounds option in the request.
                autocomplete.bindTo('bounds', map)

                // Set the data fields to return when the user selects a place.
                autocomplete.setFields(['address_components', 'geometry', 'icon', 'name'])
        
                // Set info windows content
                infowindow.setContent(infowindowContent)

                // EVENTS
                // Map on select address from autocomplete result
                autocomplete.addListener('place_changed', function(){

                    infowindow.close()
                    marker.setVisible(false)

                    const place = autocomplete.getPlace()

                    if (!place.geometry) {
                        // User entered the name of a Place that was not suggested and
                        // pressed the Enter key, or the Place Details request failed.
                        window.alert("No details available for input: '" + place.name + "'")
                        return
                    }

                    // If the place has a geometry, then present it on a map.
                    if (place.geometry.viewport) {
                        map.fitBounds(place.geometry.viewport)
                    } else {
                        map.setCenter(place.geometry.location)
                        map.setZoom(17) // Why 17? Because it looks good.
                    }

                    marker.setPosition(place.geometry.location)
                    marker.setVisible(true)

                    let address = ''

                    if (place.address_components) {
                        address = [
                            (place.address_components[0] && place.address_components[0].short_name) || '',
                            (place.address_components[1] && place.address_components[1].short_name) || '',
                            (place.address_components[2] && place.address_components[2].short_name) || '',
                        ].join(' ')
                    }

                    setInfoWindowContent(infowindowContent, place.name, address, icon)

                    infowindow.open(map, marker)
                })

                // Get position on marker move
                marker.addListener('dragend', function(){
                    getLocation(map, marker, infowindow, geocoder, setInfoWindowContent, infowindowContent, icon, marker.getPosition())
                })           
                
            },
            getLocation: function(map, marker, infowindow, geocoder, setInfoWindowContent, infowindowContent, icon, latLng, cb){

                let address
        
                const input = document.getElementById('pac-input')

                if(infowindow && marker){
                    infowindow.close()
                    marker.setVisible(false)
                }

                geocoder.geocode({ latLng: latLng }, function ( results, status ){
                    if ( status === "OK" ) { 
                        if (results[0]) {
                            address = results[0].formatted_address;
                            short_address = address.substring(0, address.indexOf(','))

                            if(map){
                                input.value = address

                                marker.setVisible(true)

                                setInfoWindowContent(infowindowContent, short_address, address, icon)
                                infowindow.open(map, marker);
                            } else {
                                cb(address)
                            }

                          } else {
                            window.alert("No results found");
                          }

                    } else {
                        window.alert("Geocoder failed due to: " + status);
                    }
                })
            },  
            getCurrentLocation: function(infowindow, map, cb){
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        position => {
                            const pos = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                            }

                            cb(pos)
                        },
                        () => {

                            if($( ".select-address" ).length){
                                $('.select-address').removeClass('loading')
                                $('.select-address').removeAttr('disabled')
                            }
                            
                            this.handleLocationError(true, infowindow, map.getCenter())
                        }
                    )
                } else {
                    if($( ".select-address" ).length){
                        $('.select-address').removeClass('loading')
                        $('.select-address').removeAttr('disabled')
                    }
                    // Browser doesn't support Geolocation
                    this.handleLocationError(false, infowindow, map.getCenter())
                }
            },
            setInfoWindowContent: function(infowindowContent, name, address, icon){
                infowindowContent.children['place-icon'].src = icon
                infowindowContent.children['place-name'].textContent = name
                infowindowContent.children['place-address'].textContent = address
            },
            handleLocationError: function(browserHasGeolocation, infoWindow, pos) {
                infoWindow.setPosition(pos);
                infoWindow.setContent(
                    browserHasGeolocation
                    ? "<p class='text-danger'>Error: The Geolocation service failed. please allow location on browser settings</p>"
                    : "<p class='text-danger'>Error: Your browser doesn't support geolocation.</p>"
                )
                infoWindow.open(this.map);
            },
            onClickInfoWindowBtn: function(cb){
                const lat = this.map.getCenter().lat()
                const lng = this.map.getCenter().lng()

                $('.select-address').addClass('loading')
                $('.select-address').attr('disabled')

                this.getLocation(false, false, false, this.geocoder, false, false, false, { lat, lng }, function(d){
                    $('.select-address').removeClass('loading')
                    $('.select-address').removeAttr('disabled')
                    return cb({ lat, lng, address: d })
                })
            }
        }
    );
});
