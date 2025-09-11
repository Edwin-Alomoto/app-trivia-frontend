// Script de debug para verificar la lógica del hook useDemoStatus

// Simular diferentes estados de usuario
const testUsers = [
  {
    name: 'Usuario Demo Activo',
    subscriptionStatus: 'demo',
    demoExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 días en el futuro
  },
  {
    name: 'Usuario Demo Expirado',
    subscriptionStatus: 'demo',
    demoExpiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 día en el pasado
  },
  {
    name: 'Usuario Suscrito',
    subscriptionStatus: 'subscribed'
  },
  {
    name: 'Usuario No Suscrito',
    subscriptionStatus: 'not_subscribed'
  }
];

// Función para simular la lógica del hook
function simulateUseDemoStatus(user) {
  const isDemoUser = user?.subscriptionStatus === 'demo';
  const isSubscribed = user?.subscriptionStatus === 'subscribed';
  
  const getDaysLeft = () => {
    if (!user?.demoExpiresAt) return 0;
    
    const expirationDate = new Date(user.demoExpiresAt);
    const currentDate = new Date();
    const diffTime = expirationDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  };

  const isExpiredDemo = () => {
    if (!isDemoUser) return false;
    return getDaysLeft() <= 0;
  };

  const canViewRewards = () => {
    return isSubscribed || (isDemoUser && !isExpiredDemo());
  };

  const canViewRaffles = () => {
    return isSubscribed || (isDemoUser && !isExpiredDemo());
  };

  const canRedeemRewards = () => {
    return isSubscribed;
  };

  const canParticipateInRaffles = () => {
    return isSubscribed;
  };

  return {
    isDemoUser,
    isSubscribed,
    daysLeft: getDaysLeft(),
    isExpiredDemo: isExpiredDemo(),
    canViewRewards: canViewRewards(),
    canViewRaffles: canViewRaffles(),
    canRedeemRewards: canRedeemRewards(),
    canParticipateInRaffles: canParticipateInRaffles()
  };
}

// Probar cada usuario
console.log('=== PRUEBAS DE LÓGICA DEL HOOK useDemoStatus ===\n');

testUsers.forEach(user => {
  const result = simulateUseDemoStatus(user);
  console.log(`📋 ${user.name}:`);
  console.log(`   - Estado: ${user.subscriptionStatus}`);
  console.log(`   - Días restantes: ${result.daysLeft}`);
  console.log(`   - Demo expirado: ${result.isExpiredDemo}`);
  console.log(`   - Puede ver premios: ${result.canViewRewards}`);
  console.log(`   - Puede ver sorteos: ${result.canViewRaffles}`);
  console.log(`   - Puede canjear premios: ${result.canRedeemRewards}`);
  console.log(`   - Puede participar en sorteos: ${result.canParticipateInRaffles}`);
  console.log('');
});

console.log('=== RESUMEN ===');
console.log('✅ Usuarios demo activos DEBEN poder ver premios y sorteos');
console.log('❌ Usuarios demo activos NO DEBEN poder canjear o participar');
console.log('❌ Usuarios demo expirados NO DEBEN poder ver nada');
console.log('✅ Usuarios suscritos DEBEN poder hacer todo');
