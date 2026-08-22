import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const API_REG_PRO = 'http://192.168.0.55/salud-api/registrar_profesional.php';

export default function RegistroProScreen({ volver, location }) {
  const [paso, setPaso] = useState(1); // Paso 1: Datos | Paso 2: Selección de Plan
  
  // Datos del Especialista
  const [nombre, setNombre] = useState('');
  const [profesion, setProfesion] = useState('psicologo');
  const [especialidad, setEspecialidad] = useState('');
  const [colegiatura, setColegiatura] = useState('');
  const [educacion, setEducacion] = useState('');
  const [experiencia, setExperiencia] = useState('5');
  const [precio, setPrecio] = useState('60');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [biografia, setBiografia] = useState('');
  const [plan, setPlan] = useState('mensual');
  const [fotoUri, setFotoUri] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const seleccionarFoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Se necesita permiso para acceder a tus fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
      base64: true,
    });

    if (!result.canceled) {
      setFotoUri(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const irAlPaso2 = () => {
    if (!nombre.trim() || !especialidad.trim() || !colegiatura.trim() || !telefono.trim()) {
      Alert.alert('Campos Obligatorios', 'Por favor llena tu nombre, especialidad, colegiatura y teléfono.');
      return;
    }
    setPaso(2);
  };

  const guardarProfesional = async () => {
    setGuardando(true);
    try {
      const res = await fetch(API_REG_PRO, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          profesion,
          especialidad,
          colegiatura,
          educacion: educacion || 'Universidad Nacional - Titulado y Colegiado',
          biografia: biografia || 'Especialista certificado enfocado en la salud y bienestar integral.',
          experiencia_anios: parseInt(experiencia) || 5,
          precio_consulta: precio,
          telefono_whatsapp: telefono,
          direccion: direccion || 'Consultorio Lima',
          modalidad: 'ambos',
          plan: plan,
          foto_url: fotoUri,
          latitud: location ? location.latitude : -12.046374,
          longitud: location ? location.longitude : -77.042793
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        Alert.alert('¡Solicitud Enviada con Éxito! 👏', 'Tu cuenta está en revisión. En breve el equipo de Equi validará tu colegiatura.');
        volver();
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (e) {
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.navbar}>
        <TouchableOpacity onPress={paso === 2 ? () => setPaso(1) : volver} style={styles.btnVolver}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.navbarTitle}>
          {paso === 1 ? 'Paso 1: Datos Profesionales' : 'Paso 2: Plan de Membresía'}
        </Text>
      </View>

      {/* ================= PASO 1: FORMULARIO DE DATOS ================= */}
      {paso === 1 && (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.fotoContainer}>
            <TouchableOpacity onPress={seleccionarFoto} style={styles.fotoBox}>
              {fotoUri ? (
                <Image source={{ uri: fotoUri }} style={styles.fotoImg} />
              ) : (
                <View style={styles.fotoPlaceholder}>
                  <Ionicons name="camera" size={32} color="#3B82F6" />
                  <Text style={styles.fotoPlaceholderText}>Subir Foto Profesional</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Profesión:</Text>
          <View style={styles.chipsRow}>
            <TouchableOpacity style={[styles.chip, profesion === 'psicologo' && styles.chipActive]} onPress={() => setProfesion('psicologo')}>
              <Text style={[styles.chipText, profesion === 'psicologo' && styles.chipTextActive]}>🧠 Psicólogo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.chip, profesion === 'nutricionista' && styles.chipActive]} onPress={() => setProfesion('nutricionista')}>
              <Text style={[styles.chipText, profesion === 'nutricionista' && styles.chipTextActive]}>🥗 Nutricionista</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Nombre Completo (con título):</Text>
          <TextInput style={styles.input} placeholder="Ej. Dra. Valeria Castro" value={nombre} onChangeText={setNombre} />

          <Text style={styles.label}>N° de Colegiatura Profesional:</Text>
          <TextInput style={styles.input} placeholder="Ej. C.Ps.P 24510 / C.N.P 8921" value={colegiatura} onChangeText={setColegiatura} />

          <Text style={styles.label}>Especialidad Principal:</Text>
          <TextInput style={styles.input} placeholder="Ej. Terapia de Pareja / Nutrición Deportiva" value={especialidad} onChangeText={setEspecialidad} />

          <Text style={styles.label}>Universidad / Grados Académicos:</Text>
          <TextInput style={styles.input} placeholder="Ej. Universidad Mayor de San Marcos - Maestría Clínica" value={educacion} onChangeText={setEducacion} />

          <Text style={styles.label}>Años de Experiencia:</Text>
          <TextInput style={styles.input} placeholder="Ej. 7" keyboardType="numeric" value={experiencia} onChangeText={setExperiencia} />

          <Text style={styles.label}>Precio por Sesión (S/.):</Text>
          <TextInput style={styles.input} placeholder="60.00" keyboardType="numeric" value={precio} onChangeText={setPrecio} />

          <Text style={styles.label}>WhatsApp Profesional:</Text>
          <TextInput style={styles.input} placeholder="+51 987 654 321" keyboardType="phone-pad" value={telefono} onChangeText={setTelefono} />

          <Text style={styles.label}>Dirección del Consultorio:</Text>
          <TextInput style={styles.input} placeholder="Ej. Av. Primavera 123, Surco" value={direccion} onChangeText={setDireccion} />

          <Text style={styles.label}>Biografía / Presentación:</Text>
          <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top' }]} multiline placeholder="Describe tu experiencia y metodología de trabajo..." value={biografia} onChangeText={setBiografia} />

          <TouchableOpacity style={styles.btnSiguiente} onPress={irAlPaso2}>
            <Text style={styles.btnSiguienteText}>Continuar al Paso 2: Elegir Plan →</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* ================= PASO 2: SELECCIÓN DE PLAN ================= */}
      {paso === 2 && (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.paso2Title}>Elige tu Membresía en Equi</Text>
          <Text style={styles.paso2Sub}>Publica tu consultorio y empieza a recibir pacientes hoy.</Text>

          <View style={styles.planesContainer}>
            <TouchableOpacity 
              style={[styles.planCard, plan === 'mensual' && styles.planCardActive]}
              onPress={() => setPlan('mensual')}
            >
              <Text style={[styles.planTitle, plan === 'mensual' && styles.planTitleActive]}>Plan Mensual</Text>
              <Text style={styles.planPrecio}>S/. 49.00 <Text style={styles.planPeriodo}>/mes</Text></Text>
              <Text style={styles.planDesc}>• Presencia en el mapa de tu zona{'\n'}• Citas ilimitadas sin comisiones{'\n'}• Contacto directo a tu WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.planCard, plan === 'anual' && styles.planCardActive]}
              onPress={() => setPlan('anual')}
            >
              <View style={styles.tagAhorro}><Text style={styles.tagAhorroText}>AHORRA 20%</Text></View>
              <Text style={[styles.planTitle, plan === 'anual' && styles.planTitleActive]}>Plan Anual</Text>
              <Text style={styles.planPrecio}>S/. 490.00 <Text style={styles.planPeriodo}>/año</Text></Text>
              <Text style={styles.planDesc}>• Todo lo del plan mensual{'\n'}• Posición destacada en las búsquedas{'\n'}• Badge de verificación prioritaria</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.btnPublicar} onPress={guardarProfesional} disabled={guardando}>
            {guardando ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnPublicarText}>Finalizar Registro & Enviar a Revisión 🚀</Text>}
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  navbar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingTop: Platform.OS === 'ios' ? 12 : 20, 
    paddingBottom: 14, 
    borderBottomWidth: 1, 
    borderColor: '#E5E7EB',
    backgroundColor: '#fff' 
  },
  btnVolver: { padding: 6, marginRight: 8 },
  navbarTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  container: { padding: 20, paddingBottom: 60, backgroundColor: '#F9FAFB' },
  fotoContainer: { alignItems: 'center', marginBottom: 16 },
  fotoBox: { width: 110, height: 110, borderRadius: 55, overflow: 'hidden', borderWidth: 2, borderColor: '#3B82F6', borderStyle: 'dashed', backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center' },
  fotoImg: { width: '100%', height: '100%' },
  fotoPlaceholder: { alignItems: 'center' },
  fotoPlaceholderText: { fontSize: 11, color: '#3B82F6', fontWeight: 'bold', marginTop: 4, textAlign: 'center' },
  label: { fontSize: 13, fontWeight: 'bold', color: '#374151', marginTop: 12, marginBottom: 4 },
  chipsRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  chip: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: '#fff', borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center' },
  chipActive: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  chipText: { fontSize: 13, fontWeight: 'bold', color: '#374151' },
  chipTextActive: { color: '#fff' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14 },
  btnSiguiente: { backgroundColor: '#3B82F6', paddingVertical: 15, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  btnSiguienteText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  
  // Paso 2
  paso2Title: { fontSize: 22, fontWeight: 'bold', color: '#111827', textAlign: 'center', marginTop: 10 },
  paso2Sub: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginTop: 6, marginBottom: 20 },
  planesContainer: { gap: 16 },
  planCard: { backgroundColor: '#fff', borderWidth: 2, borderColor: '#E5E7EB', borderRadius: 16, padding: 18 },
  planCardActive: { borderColor: '#3B82F6', backgroundColor: '#EFF6FF' },
  planTitle: { fontSize: 16, fontWeight: 'bold', color: '#374151' },
  planTitleActive: { color: '#1D4ED8' },
  planPrecio: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginVertical: 6 },
  planPeriodo: { fontSize: 14, fontWeight: 'normal', color: '#6B7280' },
  planDesc: { fontSize: 13, color: '#4B5563', lineHeight: 20, marginTop: 4 },
  tagAhorro: { position: 'absolute', top: 14, right: 14, backgroundColor: '#10B981', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tagAhorroText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  btnPublicar: { backgroundColor: '#10B981', paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 30 },
  btnPublicarText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});