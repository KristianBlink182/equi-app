import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const API_EDITAR = 'https://sistema.equi.com.pe/editar_perfil.php';

export default function MiCuentaScreen({ usuario, setUsuario, esDoctor, irAPanelDoctor, cerrarSesion }) {
  const [editando, setEditando] = useState(false);
  const [correo, setCorreo] = useState(usuario?.correo || '');
  const [telefono, setTelefono] = useState(usuario?.telefono || '');
  const [password, setPassword] = useState('');
  const [guardando, setGuardando] = useState(false);

  const guardarCambios = async () => {
    setGuardando(true);
    try {
      const res = await fetch(API_EDITAR, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: usuario.id,
          correo: correo,
          telefono: telefono,
          password: password || undefined
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        setUsuario({ ...usuario, correo: correo, telefono: telefono });
        setEditando(false);
        setPassword('');
        Alert.alert('¡Éxito!', 'Tus datos se actualizaron correctamente.');
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (e) {
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    } finally {
      setGuardando(false);
    }
  };

  const abrirWebMembresias = () => {
    Linking.openURL('https://sistema.equi.com.pe/membresia.php');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* CABECERA PERFIL */}
      <View style={styles.cardHeader}>
        <View style={[styles.avatarCircle, esDoctor && { backgroundColor: '#059669' }]}>
          <Text style={styles.avatarLetra}>{usuario?.nombre ? usuario.nombre.charAt(0) : (esDoctor ? 'Dr' : 'U')}</Text>
        </View>
        <Text style={styles.nombreUser}>{usuario?.nombre || (esDoctor ? 'Doctor Equi' : 'Paciente')}</Text>
        <View style={styles.dniBadge}>
          <Ionicons name={esDoctor ? "medkit" : "id-card"} size={16} color="#4B5563" />
          <Text style={styles.dniText}>
            {esDoctor ? `Colegiatura: ${usuario?.colegiatura || 'Verificado'}` : `DNI: ${usuario?.dni || 'Registrado'}`}
          </Text>
        </View>
      </View>

      {/* SECCIÓN EXCLUSIVA PARA ESPECIALISTAS */}
      {esDoctor && (
        <View style={styles.proPanelBox}>
          <Text style={styles.proPanelTitle}>🛠️ Mi Centro de Control Profesional</Text>

          <TouchableOpacity style={styles.btnDoctorAction} onPress={irAPanelDoctor}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Ionicons name="calendar" size={22} color="#3B82F6" />
              <View>
                <Text style={styles.btnDoctorActionTitle}>Mi Catálogo de Citas</Text>
                <Text style={styles.btnDoctorActionSub}>Ver agenda y pacientes que solicitaron consulta</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#3B82F6" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.btnDoctorAction, { borderColor: '#A7F3D0', backgroundColor: '#F0FDF4' }]} onPress={abrirWebMembresias}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Ionicons name="star" size={22} color="#059669" />
              <View>
                <Text style={[styles.btnDoctorActionTitle, { color: '#065F46' }]}>Plan de Membresía</Text>
                <Text style={styles.btnDoctorActionSub}>Ver vigencia o activar Promo 12 meses S/. 300</Text>
              </View>
            </View>
            <Ionicons name="open-outline" size={18} color="#059669" />
          </TouchableOpacity>
        </View>
      )}

      {/* EDICIÓN DE DATOS PERSONALES */}
      <View style={styles.formBox}>
        <View style={styles.rowTitleEdit}>
          <Text style={styles.sectionTitle}>Mis Datos de Contacto</Text>
          <TouchableOpacity onPress={() => setEditando(!editando)}>
            <Text style={styles.btnEditarText}>{editando ? 'Cancelar' : '✏️ Editar'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Correo Electrónico:</Text>
        <TextInput 
          style={[styles.input, !editando && styles.inputDisabled]} 
          value={correo} 
          onChangeText={setCorreo}
          editable={editando}
          keyboardType="email-address"
        />

        <Text style={styles.label}>WhatsApp / Celular:</Text>
        <TextInput 
          style={[styles.input, !editando && styles.inputDisabled]} 
          value={telefono} 
          onChangeText={setTelefono}
          editable={editando}
          keyboardType="phone-pad"
        />

        {editando && (
          <>
            <Text style={styles.label}>Nueva Contraseña (Opcional):</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Escribe para cambiar contraseña" 
              value={password} 
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.btnGuardar} onPress={guardarCambios} disabled={guardando}>
              {guardando ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnGuardarText}>Guardar Cambios</Text>}
            </TouchableOpacity>
          </>
        )}
      </View>

      <TouchableOpacity style={styles.btnCerrarSesion} onPress={cerrarSesion}>
        <Text style={styles.btnCerrarSesionText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 100 },
  cardHeader: { backgroundColor: '#fff', borderRadius: 16, padding: 20, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  avatarCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  avatarLetra: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  nombreUser: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  dniBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginTop: 8 },
  dniText: { fontSize: 13, color: '#4B5563', fontWeight: '600' },
  proPanelBox: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginTop: 14, elevation: 2, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 5 },
  proPanelTitle: { fontSize: 15, fontWeight: 'bold', color: '#1E293B', marginBottom: 12 },
  btnDoctorAction: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#EFF6FF', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#BFDBFE', marginBottom: 10 },
  btnDoctorActionTitle: { fontSize: 14, fontWeight: 'bold', color: '#1E40AF' },
  btnDoctorActionSub: { fontSize: 11, color: '#64748B', marginTop: 2 },
  formBox: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginTop: 14, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  rowTitleEdit: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  btnEditarText: { color: '#3B82F6', fontWeight: 'bold' },
  label: { fontSize: 13, fontWeight: 'bold', color: '#6B7280', marginTop: 10, marginBottom: 4 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: '#111827' },
  inputDisabled: { backgroundColor: '#F3F4F6', color: '#6B7280' },
  btnGuardar: { backgroundColor: '#10B981', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 16 },
  btnGuardarText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  btnCerrarSesion: { paddingVertical: 20, alignItems: 'center', marginTop: 10 },
  btnCerrarSesionText: { color: '#EF4444', fontWeight: 'bold', fontSize: 15 }
});