import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar, TextInput, TouchableOpacity, Text, Dimensions, Alert, Image, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';
import { LinearGradient } from 'expo-linear-gradient';

// Módulos independientes
import HomeScreen from './src/screens/HomeScreen';
import ListaProfesionalesScreen from './src/screens/ListaProfesionalesScreen';
import PerfilProfesionalScreen from './src/screens/PerfilProfesionalScreen';
import AgendarCitaScreen from './src/screens/AgendarCitaScreen';
import MisCitasScreen from './src/screens/MisCitasScreen';
import MiCuentaScreen from './src/screens/MiCuentaScreen';
import RegistroProScreen from './src/screens/RegistroProScreen';
import PanelDoctorScreen from './src/screens/PanelDoctorScreen';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: true }),
});

const API_BUSCAR = 'https://sistema.equi.com.pe/buscar.php';
const API_REGISTRO = 'https://sistema.equi.com.pe/registro.php';
const API_AGENDAR = 'https://sistema.equi.com.pe/agendar.php';
const API_ACCIONES_CITA = 'https://sistema.equi.com.pe/citas_acciones.php';

export default function App() {
  const [pantalla, setPantalla] = useState('SPLASH');
  const [rolSeleccionado, setRolSeleccionado] = useState('paciente'); // 'paciente' o 'doctor'
  const [tabActual, setTabActual] = useState('HOME');
  const [modoAuth, setModoAuth] = useState('login');
  const [usuario, setUsuario] = useState(null);
  const [esDoctor, setEsDoctor] = useState(false);

  // Formulario Auth
  const [nombreReg, setNombreReg] = useState('');
  const [dniReg, setDniReg] = useState('');
  const [correoReg, setCorreoReg] = useState('');
  const [passwordReg, setPasswordReg] = useState('');
  const [telefonoReg, setTelefonoReg] = useState('');
  const [recordarDatos, setRecordarDatos] = useState(true);
  const [cargandoAuth, setCargandoAuth] = useState(false);

  // Estados App
  const [categoria, setCategoria] = useState(null);
  const [profesionales, setProfesionales] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const [misCitas, setMisCitas] = useState([]);
  const [location, setLocation] = useState(null);
  const [cargando, setCargando] = useState(false);

  // Video Splash
  const videoSource = require('./assets/splash_video.mp4');
  const player = useVideoPlayer(videoSource, p => {
    p.loop = false;
    p.play();
  });

  useEffect(() => {
    const sub = player.addListener('playToEnd', () => setPantalla('AUTH'));
    return () => sub?.remove();
  }, [player]);

  useEffect(() => {
    (async () => {
      await Notifications.requestPermissionsAsync();
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
      }

      const guardado = await AsyncStorage.getItem('@equi_usuario');
      if (guardado) {
        setCorreoReg(guardado);
        setRecordarDatos(true);
      }
    })();
  }, []);

  const handleAuth = async () => {
    setCargandoAuth(true);
    try {
      if (recordarDatos) {
        await AsyncStorage.setItem('@equi_usuario', correoReg);
      } else {
        await AsyncStorage.removeItem('@equi_usuario');
      }

      // ACCESO ESPECIALISTA
      if (rolSeleccionado === 'doctor') {
        setEsDoctor(true);
        setUsuario({
          id: 1,
          nombre: correoReg.includes('laura') ? 'Dra. Laura Morales' : 'Especialista Equi',
          correo: correoReg,
          telefono: '997415600',
          colegiatura: 'C.Ps.P 24510'
        });
        setPantalla('MAIN');
        setCargandoAuth(false);
        return;
      }

      // ACCESO PACIENTE
      setEsDoctor(false);
      let bodyData = { accion: modoAuth };
      if (modoAuth === 'registro') {
        if (!nombreReg || !dniReg || !correoReg || !passwordReg) {
          Alert.alert('Error', 'Completa todos los campos requeridos');
          setCargandoAuth(false);
          return;
        }
        bodyData = { ...bodyData, nombre: nombreReg, dni: dniReg, correo: correoReg, telefono: telefonoReg, password: passwordReg };
      } else {
        bodyData = { ...bodyData, dni_correo: correoReg, password: passwordReg };
      }

      const res = await fetch(API_REGISTRO, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });
      const data = await res.json();
      if (data.status === 'success') {
        setUsuario(data.user);
        setPantalla('MAIN');
      } else {
        Alert.alert('Atención', data.message || 'Error de credenciales');
      }
    } catch (e) {
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    } finally {
      setCargandoAuth(false);
    }
  };

  const buscarProfesionales = async (tipo) => {
    setCategoria(tipo);
    setCargando(true);
    setPantalla('LISTA');

    const lat = location ? location.latitude : -12.046374;
    const lng = location ? location.longitude : -77.042793;

    try {
      const response = await fetch(`${API_BUSCAR}?tipo=${tipo}&lat=${lat}&lng=${lng}`);
      const data = await response.json();
      setProfesionales(Array.isArray(data) ? data : []);
    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  const confirmarCita = async (fechaParam, horaParam, modalidadParam) => {
    try {
      const fechaFinal = fechaParam || "Fecha por coordinar";
      const horaFinal = horaParam || "10:00 AM";
      const modalidadFinal = modalidadParam || "presencial";

      const res = await fetch(API_AGENDAR, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: usuario?.id || 1,
          profesional_id: seleccionado.id,
          fecha: fechaFinal,
          hora: horaFinal,
          modalidad: modalidadFinal
        })
      });
      const data = await res.json();

      if (data.status === 'error') {
        Alert.alert('Atención', data.message);
        return;
      }

      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '🔔 Recordatorio Equi',
            body: `Tu cita con ${seleccionado.nombre} está programada para el ${fechaFinal} a las ${horaFinal}.`,
          },
          trigger: null,
        });
      } catch (notifErr) {}

      const nuevaCita = {
        id: Date.now().toString(),
        profesional: seleccionado.nombre,
        especialidad: seleccionado.especialidad,
        foto: seleccionado.foto_url,
        fecha: fechaFinal,
        hora: horaFinal,
        modalidad: modalidadFinal,
        precio: seleccionado.precio_consulta,
        estado: 'pendiente'
      };

      setMisCitas([nuevaCita, ...misCitas]);
      Alert.alert('¡Cita Confirmada! 🎉', `Te esperamos el ${fechaFinal} a las ${horaFinal}.`);
      setPantalla('MAIN');
      setTabActual('CITAS');
    } catch (e) {
      Alert.alert('Error', 'No se pudo agendar la consulta.');
    }
  };

  const cancelarCitaPaciente = (citaId) => {
    Alert.alert('Cancelar Cita', '¿Deseas cancelar esta consulta?', [
      { text: 'No' },
      {
        text: 'Sí, cancelar',
        style: 'destructive',
        onPress: async () => {
          try {
            await fetch(API_ACCIONES_CITA, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ accion: 'cancelar', cita_id: citaId })
            });
            setMisCitas(misCitas.map(c => c.id === citaId ? { ...c, estado: 'cancelada' } : c));
          } catch (e) {}
        }
      }
    ]);
  };

  // ================= RENDER =================
  if (pantalla === 'SPLASH') {
    return (
      <View style={styles.splashContainer}>
        <StatusBar hidden={true} />
        <VideoView style={styles.fullScreenVideo} player={player} contentFit="cover" nativeControls={false} />
      </View>
    );
  }

  // AUTH
  if (pantalla === 'AUTH') {
    return (
      <LinearGradient colors={['#EFF6FF', '#F0FDF4', '#FFFFFF']} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar barStyle="dark-content" />
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.authContainer}>
              <Image source={require('./assets/logo.png')} style={styles.logoAuth} resizeMode="contain" />

              <View style={styles.rolSelector}>
                <TouchableOpacity 
                  style={[styles.rolBtn, rolSeleccionado === 'paciente' && styles.rolBtnActivo]} 
                  onPress={() => { setRolSeleccionado('paciente'); setModoAuth('login'); }}
                >
                  <Text style={[styles.rolBtnText, rolSeleccionado === 'paciente' && styles.rolBtnTextActivo]}>👤 Soy Paciente</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.rolBtn, rolSeleccionado === 'doctor' && styles.rolBtnActivo]} 
                  onPress={() => { setRolSeleccionado('doctor'); setModoAuth('login'); }}
                >
                  <Text style={[styles.rolBtnText, rolSeleccionado === 'doctor' && styles.rolBtnTextActivo]}>👨‍⚕️ Soy Especialista</Text>
                </TouchableOpacity>
              </View>

              {rolSeleccionado === 'paciente' && (
                <View style={styles.tabAuthContainer}>
                  <TouchableOpacity style={[styles.tabAuth, modoAuth === 'login' && styles.tabAuthActive]} onPress={() => setModoAuth('login')}>
                    <Text style={[styles.tabAuthText, modoAuth === 'login' && styles.tabAuthTextActive]}>Ingresar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.tabAuth, modoAuth === 'registro' && styles.tabAuthActive]} onPress={() => setModoAuth('registro')}>
                    <Text style={[styles.tabAuthText, modoAuth === 'registro' && styles.tabAuthTextActive]}>Registrarse</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.formBox}>
                {rolSeleccionado === 'paciente' && modoAuth === 'registro' && (
                  <>
                    <Text style={styles.labelInput}>DNI:</Text>
                    <TextInput style={styles.inputAuth} placeholder="8 dígitos" keyboardType="numeric" maxLength={8} value={dniReg} onChangeText={setDniReg} />
                    <Text style={styles.labelInput}>Nombre Completo:</Text>
                    <TextInput style={styles.inputAuth} placeholder="Ej. Juan Pérez" value={nombreReg} onChangeText={setNombreReg} />
                    <Text style={styles.labelInput}>WhatsApp / Celular:</Text>
                    <TextInput style={styles.inputAuth} placeholder="999 999 999" keyboardType="phone-pad" value={telefonoReg} onChangeText={setTelefonoReg} />
                  </>
                )}

                <Text style={styles.labelInput}>{rolSeleccionado === 'doctor' ? 'Correo Profesional:' : modoAuth === 'login' ? 'DNI o Correo:' : 'Correo Electrónico:'}</Text>
                <TextInput style={styles.inputAuth} placeholder={rolSeleccionado === 'doctor' ? 'laura@equi.pe' : 'ejemplo@correo.com'} keyboardType="email-address" autoCapitalize="none" value={correoReg} onChangeText={setCorreoReg} />

                <Text style={styles.labelInput}>Contraseña:</Text>
                <TextInput style={styles.inputAuth} placeholder="••••••" secureTextEntry value={passwordReg} onChangeText={setPasswordReg} />

                <TouchableOpacity style={styles.rowRecordar} onPress={() => setRecordarDatos(!recordarDatos)}>
                  <Ionicons name={recordarDatos ? "checkbox" : "square-outline"} size={20} color="#3B82F6" />
                  <Text style={styles.textRecordar}>Recordar mis datos de acceso</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnPrincipal} onPress={handleAuth} disabled={cargandoAuth}>
                  {cargandoAuth ? <ActivityIndicator color="#fff" /> : (
                    <Text style={styles.btnPrincipalText}>
                      {rolSeleccionado === 'doctor' ? 'Entrar al Panel de Especialista →' : modoAuth === 'registro' ? 'Crear Cuenta en Equi →' : 'Iniciar Sesión →'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.lemaBox}>
                <Text style={styles.lemaTexto}>🇵🇪 La red de salud mental y nutrición más grande y confiable del Perú.</Text>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // PANTALLA PRINCIPAL (NAVEGACIÓN COMPLETA PARA PACIENTES Y DOCTORES)
  if (pantalla === 'MAIN') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        {tabActual === 'HOME' && <HomeScreen usuario={usuario} buscarProfesionales={buscarProfesionales} />}
        {tabActual === 'CITAS' && (
  <MisCitasScreen 
    usuarioId={usuario?.id || 1} 
    cancelarCita={cancelarCitaPaciente} 
    irAHome={() => setTabActual('HOME')} 
  />
)}
        {tabActual === 'CUENTA' && (
          <MiCuentaScreen 
            usuario={usuario} 
            setUsuario={setUsuario} 
            esDoctor={esDoctor}
            irAPanelDoctor={() => setPantalla('PANEL_DOCTOR')} 
            cerrarSesion={() => setPantalla('AUTH')} 
          />
        )}

        <View style={styles.bottomTabBar}>
          <TouchableOpacity style={styles.tabItem} onPress={() => setTabActual('HOME')}>
            <Ionicons name="home" size={24} color={tabActual === 'HOME' ? '#3B82F6' : '#9CA3AF'} />
            <Text style={[styles.tabLabel, tabActual === 'HOME' && styles.tabLabelActive]}>Inicio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={() => setTabActual('CITAS')}>
            <Ionicons name="calendar" size={24} color={tabActual === 'CITAS' ? '#3B82F6' : '#9CA3AF'} />
            <Text style={[styles.tabLabel, tabActual === 'CITAS' && styles.tabLabelActive]}>Mis Citas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={() => setTabActual('CUENTA')}>
            <Ionicons name="person" size={24} color={tabActual === 'CUENTA' ? '#3B82F6' : '#9CA3AF'} />
            <Text style={[styles.tabLabel, tabActual === 'CUENTA' && styles.tabLabelActive]}>Mi Cuenta</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // PANTALLAS MODULARES
  if (pantalla === 'LISTA') return <ListaProfesionalesScreen volver={() => setPantalla('MAIN')} categoria={categoria} cargando={cargando} profesionales={profesionales} verPerfil={(p) => { setSeleccionado(p); setPantalla('PERFIL'); }} />;
  if (pantalla === 'PERFIL') return <PerfilProfesionalScreen volver={() => setPantalla('LISTA')} seleccionado={seleccionado} irAAgendar={() => setPantalla('AGENDAR')} />;
  if (pantalla === 'AGENDAR') return <AgendarCitaScreen volver={() => setPantalla('PERFIL')} seleccionado={seleccionado} confirmarCita={confirmarCita} />;
  if (pantalla === 'PANEL_DOCTOR') return <PanelDoctorScreen volver={() => setPantalla('MAIN')} doctorId={usuario?.id || 1} doctorNombre={usuario?.nombre || "Especialista Equi"} />;
  if (pantalla === 'REGISTRO_PRO') return <RegistroProScreen volver={() => setPantalla('AUTH')} location={location} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  splashContainer: { flex: 1, backgroundColor: '#ffffff', width: SCREEN_WIDTH, height: SCREEN_HEIGHT },
  fullScreenVideo: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT },
  authContainer: { padding: 24, alignItems: 'center' },
  logoAuth: { width: 160, height: 80, marginTop: 15, marginBottom: 10 },
  rolSelector: { flexDirection: 'row', backgroundColor: '#E2E8F0', borderRadius: 14, padding: 4, width: '100%', marginBottom: 14 },
  rolBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  rolBtnActivo: { backgroundColor: '#3B82F6' },
  rolBtnText: { fontSize: 13, fontWeight: 'bold', color: '#475569' },
  rolBtnTextActivo: { color: '#fff' },
  tabAuthContainer: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 12, padding: 4, marginBottom: 14, width: '100%' },
  tabAuth: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabAuthActive: { backgroundColor: '#fff' },
  tabAuthText: { fontSize: 13, fontWeight: 'bold', color: '#64748b' },
  tabAuthTextActive: { color: '#3B82F6' },
  formBox: { width: '100%', gap: 10, backgroundColor: '#ffffff', padding: 20, borderRadius: 20, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  labelInput: { fontSize: 13, fontWeight: 'bold', color: '#374151' },
  inputAuth: { backgroundColor: '#F8FAFC', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 11, fontSize: 14 },
  rowRecordar: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  textRecordar: { fontSize: 13, color: '#4B5563', fontWeight: '500' },
  btnPrincipal: { backgroundColor: '#3B82F6', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  btnPrincipalText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  lemaBox: { marginTop: 30, paddingHorizontal: 20 },
  lemaTexto: { textAlign: 'center', color: '#64748B', fontSize: 12.5, fontWeight: '600', lineHeight: 18 },
  bottomTabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 68, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderColor: '#E5E7EB' },
  tabItem: { alignItems: 'center', justifyContent: 'center' },
  tabLabel: { fontSize: 11, color: '#9CA3AF', marginTop: 3, fontWeight: '600' },
  tabLabelActive: { color: '#3B82F6', fontWeight: 'bold' }
});