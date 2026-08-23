import { ImageResponse } from 'next/og';
import { storeConfig } from './config/store';

export const alt = `${storeConfig.name} — Cardápio digital`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fffaf6',
          color: '#211713',
          padding: 72,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            borderRadius: 52,
            background: '#ffffff',
            padding: 72,
          }}
        >
          <div style={{ display: 'flex', color: '#e74423', fontSize: 30, fontWeight: 800 }}>
            CARDÁPIO DIGITAL
          </div>
          <div style={{ display: 'flex', marginTop: 24, fontSize: 76, fontWeight: 800 }}>
            {storeConfig.name}
          </div>
          <div style={{ display: 'flex', marginTop: 24, color: '#786b64', fontSize: 34 }}>
            Escolha seus produtos e monte seu pedido pelo celular.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
