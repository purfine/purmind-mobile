/**
 * Emoji Loader
 * 
 * Script para baixar emojis e gerar mapeamento
 * 
 * É ESTRITAMENTE PROIBIDO ALTERAR ESSE ARQUIVO SEM AUTORIZAÇÃO PRÉVIA.
 * @author Victor
 */

const fs = require('fs');
const https = require('https');
const path = require('path');
const { URL } = require('url');

// ========================================
// CONFIGURAÇÕES
// ========================================
const CONFIG = {
  timeout: 30000, // 30 segundos para download
  minFileSize: 100, // Tamanho mínimo para arquivo PNG válido (bytes)
  maxRetries: 2, // Tentativas de download
  retryDelay: 2000, // Atraso entre tentativas (ms)
};

// ========================================
// SETUP DE CAMINHOS
// ========================================
const projectRoot = path.resolve(__dirname, '..');
const PATHS = {
  emojiDir: path.join(projectRoot, 'assets', 'emojis', 'img'),
  dataFile: path.join(projectRoot, 'assets', 'emojis', 'data.json'),
  mapFile: path.join(projectRoot, 'utils', 'emojiMap.ts'),
};

// ========================================
// UTILITÁRIOS
// ========================================
function createDirIfNotExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Diretório criado: ${dirPath}`);
  }
}

function validateImage(filePath) {
  try {
    // Verificação básica do arquivo
    const stats = fs.statSync(filePath);
    if (stats.size < CONFIG.minFileSize) {
      console.warn(`⚠️ Arquivo ${path.basename(filePath)} é muito pequeno (${stats.size} bytes)`);
      return false;
    }

    // Verificação do header PNG
    const buffer = Buffer.alloc(8);
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buffer, 0, 8, 0);
    fs.closeSync(fd);
    
    const isPng = buffer.toString('hex').startsWith('89504e470d0a1a0a');
    if (!isPng) {
      console.warn(`⚠️ Arquivo ${path.basename(filePath)} não é um PNG válido`);
    }
    
    return isPng;
  } catch (error) {
    console.warn(`⚠️ Erro ao validar ${path.basename(filePath)}:`, error.message);
    return false;
  }
}

async function downloadWithRetry(url, filePath, retries = CONFIG.maxRetries) {
  return new Promise((resolve, reject) => {
    const attemptDownload = (attempt = 1) => {
      const file = fs.createWriteStream(filePath);
      const filename = path.basename(filePath);

      console.log(`⬇️ Tentativa ${attempt} para ${filename}...`);

      const request = https.get(url, (response) => {
        // Verificar resposta
        if (response.statusCode !== 200) {
          file.close();
          fs.unlinkSync(filePath);
          return reject(new Error(`Status ${response.statusCode}`));
        }

        // Verificar tipo de conteúdo
        const contentType = response.headers['content-type'];
        if (!contentType?.includes('image/png')) {
          file.close();
          fs.unlinkSync(filePath);
          return reject(new Error(`Tipo de conteúdo inválido: ${contentType || 'desconhecido'}`));
        }

        // Download
        response.pipe(file);

        file.on('finish', () => {
          file.close();
          if (validateImage(filePath)) {
            console.log(`✅ Download concluído: ${filename}`);
            resolve(true);
          } else {
            fs.unlinkSync(filePath);
            reject(new Error('Arquivo inválido'));
          }
        });
      });

      request.setTimeout(CONFIG.timeout, () => {
        request.destroy();
        fs.unlinkSync(filePath);
        if (attempt < retries) {
          console.log(`⏳ Aguardando ${CONFIG.retryDelay/1000}s para tentar novamente...`);
          setTimeout(() => attempt(attempt + 1), CONFIG.retryDelay);
        } else {
          reject(new Error(`Timeout após ${CONFIG.timeout/1000}s`));
        }
      });

      request.on('error', (err) => {
        fs.unlinkSync(filePath);
        if (attempt < retries) {
          setTimeout(() => attempt(attempt + 1), CONFIG.retryDelay);
        } else {
          reject(err);
        }
      });
    };

    attemptDownload();
  });
}

// ========================================
// GERADOR DE MAPEAMENTO
// ========================================
function generateEmojiMap(emojiData) {
  try {
    const emojiFiles = fs.readdirSync(PATHS.emojiDir)
      .filter(file => file.endsWith('.png') && validateImage(path.join(PATHS.emojiDir, file)));

    console.log(`[DEBUG] Caminho do emojiMap: ${PATHS.mapFile}`);
    console.log(`[DEBUG] Emojis válidos encontrados: ${emojiFiles.length}`);

    const header = `// AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
// Gerado em: ${new Date().toISOString()}
// Total de emojis: ${emojiFiles.length}

/**
 * Mapeamento de emojis para uso no React Native
 * Formato: { 'emoji-name': require('../path/to/emoji.png') }
 */
type EmojiMap = {
  [key: string]: any; // React Native require() returns a number
};

`;

    let mapping = '';
    if (emojiFiles.length > 0) {
      // No React Native, não podemos usar caminhos dinâmicos com require()
      // Então definimos cada emoji com seu próprio require() estático
      mapping = `const emojiMap: EmojiMap = {\n${emojiFiles.map(file => {
        const name = path.basename(file, '.png');
        const source = emojiData[name] ? new URL(emojiData[name]).hostname : 'source unknown';
        // No React Native, precisa ser um literal estático. Não pode ser dinâmico.
        return `  '${name}': require('../assets/emojis/img/${file}'), // ${source}`;
      }).join('\n')}\n};\n\nexport default emojiMap;\n`;
    } else {
      console.warn('⚠️ Nenhum emoji válido encontrado - gerando mapeamento vazio');
      mapping = `const emojiMap: EmojiMap = {};\n\nexport default emojiMap;\n`;
    }

    fs.writeFileSync(PATHS.mapFile, header + mapping);
    console.log(`📝 Mapeamento gerado com ${emojiFiles.length} emojis em ${PATHS.mapFile}`);
    
    // Verificar se o arquivo foi escrito com sucesso
    if (fs.existsSync(PATHS.mapFile)) {
      const stats = fs.statSync(PATHS.mapFile);
      console.log(`[DEBUG] Arquivo criado/atualizado com sucesso (${stats.size} bytes)`);
    } else {
      console.error(`[ERROR] Falha ao escrever o arquivo: ${PATHS.mapFile} não existe após writeFileSync`);
    }
  } catch (error) {
    console.error('❌ Falha ao gerar mapeamento:', error);
    throw error;
  }
}

// ========================================
// VERIFICAÇÃO DE CONECTIVIDADE
// ========================================
async function checkInternetConnection() {
  return new Promise((resolve) => {
    https.get('https://www.google.com', { timeout: 5000 }, (res) => {
      resolve(res.statusCode === 200);
    }).on('error', () => resolve(false));
  });
}

// ========================================
// PROCESSO PRINCIPAL
// ========================================
async function main() {
  console.log(`
=======================================
  Purfine&Co - Emoji Loader v2.0
  Data: ${new Date().toLocaleString()}
=======================================
`);

  try {
    // Configurar ambiente
    createDirIfNotExists(PATHS.emojiDir);
    createDirIfNotExists(path.dirname(PATHS.mapFile));

    // Criar arquivo de mapeamento inicial se não existir
    if (!fs.existsSync(PATHS.mapFile)) {
      fs.writeFileSync(PATHS.mapFile, 
        `// AUTO-GENERATED FILE - DO NOT EDIT MANUALLY\n` +
        `type EmojiMap = {\n` +
        `  [key: string]: number;\n` +
        `};\n\n` +
        `const emojiMap: EmojiMap = {};\n\n` +
        `export default emojiMap;`
      );
      console.log('📄 Arquivo de mapeamento inicial criado');
    }

    // Carregar dados dos emojis
    const emojiData = JSON.parse(fs.readFileSync(PATHS.dataFile, 'utf8'));
    const emojiKeys = Object.keys(emojiData);

    // Verificar emojis existentes
    const existingFiles = fs.readdirSync(PATHS.emojiDir)
      .filter(file => file.endsWith('.png') && validateImage(path.join(PATHS.emojiDir, file)))
      .map(file => file.replace('.png', ''));

    const missingKeys = emojiKeys.filter(key => !existingFiles.includes(key));

    // Verificar conexão com a internet
    const hasInternet = await checkInternetConnection();
    if (!hasInternet && missingKeys.length > 0) {
      console.warn('⚠️ Sem conexão com a internet - usando apenas emojis existentes');
    }

    // Baixar emojis faltantes (se houver internet)
    if (hasInternet && missingKeys.length > 0) {
      console.log(`🔍 ${missingKeys.length} emojis faltantes detectados`);

      for (const key of missingKeys) {
        try {
          const filePath = path.join(PATHS.emojiDir, `${key}.png`);
          await downloadWithRetry(emojiData[key], filePath);
        } catch (error) {
          console.error(`❌ Falha ao baixar ${key}:`, error.message);
        }
      }
    } else if (missingKeys.length === 0) {
      console.log('👍 Todos os emojis já estão presentes e válidos');
    }

    // Gerar/atualizar mapeamento
    generateEmojiMap(emojiData);

    console.log(`
✅ Processo concluído com sucesso!
=======================================
`);
  } catch (error) {
    console.error(`
❌ ERRO NO PROCESSO: ${error.message}
=======================================
`);
    process.exit(1);
  }
}

// Executar
main();